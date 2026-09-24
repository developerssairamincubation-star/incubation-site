"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { discardUploads, saveContent, type SaveIssue } from "@/app/admin/actions";
import type { ContentKey } from "@/lib/content/schema";

export type EditorStatus =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved" }
  | { kind: "error"; message: string; conflict?: boolean };

/**
 * Local editing state for one section. Changes stay in the browser until
 * "Save changes" sends the whole list at once; "Discard" puts it back.
 */
export function useCollectionEditor<T extends { id: string }>(
  key: ContentKey,
  initial: T[],
  initialVersion: number,
) {
  const [items, setItems] = useState<T[]>(initial);
  const [saved, setSaved] = useState<T[]>(initial);
  const [version, setVersion] = useState(initialVersion);
  const [status, setStatus] = useState<EditorStatus>({ kind: "idle" });
  const [issues, setIssues] = useState<SaveIssue[]>([]);
  // Images uploaded since the last save — cleaned up if they're not kept.
  const sessionUploads = useRef(new Set<string>());

  const dirty = useMemo(
    () => JSON.stringify(items) !== JSON.stringify(saved),
    [items, saved],
  );

  // Warn before closing the tab or navigating away with unsaved work.
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  // Any edit moves the bar back to "unsaved changes" — except after a
  // conflict, which only a reload resolves, so that message stays put.
  const touch = () =>
    setStatus((current) =>
      current.kind === "saved" || (current.kind === "error" && !current.conflict)
        ? { kind: "idle" }
        : current,
    );

  // Validation issues are keyed by position, so any change to the list's
  // shape makes them point at the wrong items — drop them all.
  const reshape = () => {
    touch();
    setIssues([]);
  };

  const update = (id: string, patch: Partial<T>) => {
    touch();
    const index = items.findIndex((item) => item.id === id);
    const fields = new Set(Object.keys(patch));
    // Editing a field clears that field's error; the rest stay visible.
    setIssues((current) =>
      current.filter(
        (issue) => !(issue.path[0] === index && fields.has(String(issue.path[1]))),
      ),
    );
    setItems((list) => list.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const add = (item: T, where: "start" | "end" = "end") => {
    reshape();
    setItems((list) => (where === "start" ? [item, ...list] : [...list, item]));
  };

  const remove = (id: string) => {
    reshape();
    setItems((list) => list.filter((item) => item.id !== id));
  };

  const move = (id: string, delta: -1 | 1) => {
    reshape();
    setItems((list) => {
      const from = list.findIndex((item) => item.id === id);
      const to = from + delta;
      if (from < 0 || to < 0 || to >= list.length) return list;
      const next = [...list];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
  };

  const trackUpload = (url: string) => {
    sessionUploads.current.add(url);
  };

  const save = async () => {
    setStatus({ kind: "saving" });
    const result = await saveContent(key, items, version, [...sessionUploads.current]);
    if (result.ok) {
      const data = result.data as unknown as T[];
      setItems(data);
      setSaved(data);
      setVersion(result.version);
      setIssues([]);
      sessionUploads.current.clear();
      setStatus({ kind: "saved" });
    } else {
      setIssues(result.issues ?? []);
      setStatus({ kind: "error", message: result.error, conflict: result.conflict });
    }
  };

  const discard = async () => {
    const unsaved = [...sessionUploads.current];
    sessionUploads.current.clear();
    setItems(saved);
    setIssues([]);
    setStatus({ kind: "idle" });
    if (unsaved.length > 0) await discardUploads(unsaved);
  };

  /** Server-side validation message for one field of the item at `index`. */
  const errorFor = (index: number, field: string) =>
    issues.find(
      (issue) => issue.path[0] === index && issue.path.slice(1).join(".") === field,
    )?.message;

  const itemHasError = (index: number) => issues.some((issue) => issue.path[0] === index);

  /** Problems with the list as a whole (e.g. "Keep at least one hero image"). */
  const listErrors = issues.filter((issue) => issue.path.length === 0).map((i) => i.message);

  return {
    items,
    dirty,
    status,
    update,
    add,
    remove,
    move,
    trackUpload,
    save,
    discard,
    errorFor,
    itemHasError,
    listErrors,
  };
}

export type CollectionEditor<T extends { id: string }> = ReturnType<
  typeof useCollectionEditor<T>
>;

export function newId() {
  return crypto.randomUUID();
}

/** Brings a just-added item into view once it has rendered. */
export function revealItem(id: string) {
  requestAnimationFrame(() =>
    document
      .getElementById(`item-${id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" }),
  );
}
