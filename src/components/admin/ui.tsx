"use client";

import clsx from "clsx";
import { useId } from "react";
import type { EditorStatus } from "./useCollectionEditor";
import { PAGE_SIZE_CHOICES, type PageSizeChoice, type SortMode } from "./useListView";

export const inputClass =
  "w-full rounded-lg border border-line/70 bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-gold focus:ring-2 focus:ring-gold/25 aria-[invalid=true]:border-rust aria-[invalid=true]:ring-rust/20";

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: (props: { id: string; "aria-invalid"?: true; "aria-describedby"?: string }) => React.ReactNode;
}) {
  const id = useId();
  const noteId = `${id}-note`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold text-ink">
        {label}
      </label>
      {children({
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error || hint ? noteId : undefined,
      })}
      {(error || hint) && (
        <p
          id={noteId}
          className={clsx("mt-1.5 text-[12.5px]", error ? "text-rust" : "text-ink-soft")}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

export function Button({
  variant = "secondary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}) {
  return (
    <button
      type="button"
      {...props}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-[14px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        {
          primary: "bg-ink text-white hover:bg-ink/85",
          secondary: "border border-line/80 bg-white text-ink hover:border-ink/40",
          danger: "border border-rust/30 bg-white text-rust hover:bg-rust/5",
          ghost: "text-ink-soft hover:bg-ink/5 hover:text-ink",
        }[variant],
        className,
      )}
    />
  );
}

/** Header row for an editor page: title, explanation, and the add button. */
export function EditorHeader({
  title,
  description,
  addLabel,
  onAdd,
  addDisabled,
  addDisabledReason,
}: {
  title: string;
  description: string;
  addLabel: string;
  onAdd: () => void;
  addDisabled?: boolean;
  addDisabledReason?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-[640px]">
        <h1 className="text-[26px] font-bold text-ink">{title}</h1>
        <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{description}</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <Button variant="primary" onClick={onAdd} disabled={addDisabled}>
          + {addLabel}
        </Button>
        {addDisabled && addDisabledReason && (
          <span className="text-[12px] text-ink-soft">{addDisabledReason}</span>
        )}
      </div>
    </div>
  );
}

/** One item in a list: position, reorder buttons, remove, and its fields. */
export function ItemCard({
  domId,
  index,
  count,
  heading,
  onMove,
  onRemove,
  removeConfirm,
  hasError,
  canMove = true,
  aside,
  children,
}: {
  domId: string;
  index: number;
  count: number;
  heading: string;
  onMove: (delta: -1 | 1) => void;
  onRemove: () => void;
  removeConfirm: string;
  hasError?: boolean;
  /** Off while a search filter is active — "up" would be ambiguous. */
  canMove?: boolean;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li
      id={domId}
      className={clsx(
        "scroll-mt-24 rounded-2xl border bg-white p-5 shadow-[0_6px_20px_rgba(0,0,0,0.04)]",
        hasError ? "border-rust/50" : "border-line/60",
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-cream text-[13px] font-bold text-ink-soft">
            {index + 1}
          </span>
          <h2 className="truncate text-[16px] font-semibold text-ink">{heading}</h2>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {aside}
          <Button
            variant="ghost"
            className="px-2.5"
            onClick={() => onMove(-1)}
            disabled={!canMove || index === 0}
            aria-label={`Move “${heading}” up`}
          >
            ↑
          </Button>
          <Button
            variant="ghost"
            className="px-2.5"
            onClick={() => onMove(1)}
            disabled={!canMove || index === count - 1}
            aria-label={`Move “${heading}” down`}
          >
            ↓
          </Button>
          <Button
            variant="danger"
            className="ml-1 px-3"
            onClick={() => {
              if (window.confirm(removeConfirm)) onRemove();
            }}
          >
            Remove
          </Button>
        </div>
      </div>
      {children}
    </li>
  );
}

/** Sticky bar that appears once there's something to save. */
export function SaveBar({
  dirty,
  status,
  listErrors,
  onSave,
  onDiscard,
}: {
  dirty: boolean;
  status: EditorStatus;
  listErrors: string[];
  onSave: () => void;
  onDiscard: () => void;
}) {
  const saving = status.kind === "saving";
  const visible = dirty || status.kind === "saved" || status.kind === "error";
  if (!visible) return null;

  return (
    <div className="sticky bottom-4 z-20 mt-8">
      <div
        role="status"
        aria-live="polite"
        className={clsx(
          "flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-5 py-3.5 shadow-[0_14px_40px_rgba(0,0,0,0.12)] backdrop-blur",
          status.kind === "error"
            ? "border-rust/40 bg-white"
            : status.kind === "saved" && !dirty
              ? "border-emerald-600/30 bg-white"
              : "border-line/60 bg-white/95",
        )}
      >
        <div className="text-[14px]">
          {status.kind === "error" ? (
            <div className="text-rust">
              <p className="font-semibold">{status.message}</p>
              {listErrors.map((message) => (
                <p key={message}>{message}</p>
              ))}
              {status.conflict && (
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-1 font-semibold underline"
                >
                  Reload the latest version
                </button>
              )}
            </div>
          ) : status.kind === "saved" && !dirty ? (
            <p className="font-semibold text-emerald-700">
              Saved — the live site is updated.
            </p>
          ) : (
            <p className="font-semibold text-ink">You have unsaved changes.</p>
          )}
        </div>
        {dirty && (
          <div className="flex gap-2">
            <Button onClick={onDiscard} disabled={saving}>
              Discard
            </Button>
            <Button variant="primary" onClick={onSave} disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white/60 px-6 py-12 text-center text-[15px] text-ink-soft">
      {children}
    </div>
  );
}

/** Search / sort row above a list, plus the note explaining why reordering is paused. */
export function ListControls({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6">
      <div
        role="search"
        aria-label={label}
        className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3"
      >
        {children}
      </div>
      {hint && <p className="mt-2 text-[13px] text-ink-soft">{hint}</p>}
    </div>
  );
}

/** Visible-label-free search box; the label is read by screen readers. */
export function SearchField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div className="w-full max-w-[340px]">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type="search"
        value={value}
        placeholder={placeholder ?? label}
        autoComplete="off"
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </div>
  );
}

/** Native select on purpose — keyboard and screen-reader support come for free. */
export function SortSelect({
  label = "Sort by",
  keyLabel = "Name",
  value,
  onChange,
}: {
  label?: string;
  keyLabel?: string;
  value: SortMode;
  onChange: (value: SortMode) => void;
}) {
  const id = useId();
  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="text-[13px] font-semibold whitespace-nowrap text-ink">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as SortMode)}
        className={`${inputClass} w-auto`}
      >
        <option value="none">Manual order</option>
        <option value="asc">{keyLabel} (A–Z)</option>
        <option value="desc">{keyLabel} (Z–A)</option>
        <option value="newest">Recently added</option>
        <option value="oldest">Oldest first</option>
      </select>
    </div>
  );
}

/** First, last and the pages around the current one, with gaps collapsed. */
function pageWindow(page: number, pageCount: number): (number | "gap")[] {
  const wanted = new Set([1, pageCount, page - 1, page, page + 1]);
  const pages = [...wanted].filter((n) => n >= 1 && n <= pageCount).sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  pages.forEach((n, i) => {
    if (i > 0 && n - pages[i - 1] > 1) out.push("gap");
    out.push(n);
  });
  return out;
}

/**
 * Page controls plus a "how many to show" dropdown, placed above the list.
 * Renders nothing when everything already fits in the smallest page size.
 */
export function Pagination({
  label = "Pagination",
  page,
  pageCount,
  pageSize,
  sizeChoice,
  totalMatches,
  onPageChange,
  onSizeChange,
}: {
  label?: string;
  page: number;
  pageCount: number;
  pageSize: number;
  sizeChoice: PageSizeChoice;
  totalMatches: number;
  onPageChange: (page: number) => void;
  onSizeChange: (size: PageSizeChoice) => void;
}) {
  const sizeId = useId();
  const smallest = PAGE_SIZE_CHOICES.find((size): size is number => size !== "all") ?? 5;
  if (totalMatches <= smallest) return null;

  const showAll = sizeChoice === "all";
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalMatches);

  return (
    <nav
      aria-label={label}
      className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3"
    >
      <p role="status" className="text-[13px] text-ink-soft">
        {showAll
          ? `Showing all ${totalMatches}`
          : `Showing ${start}–${end} of ${totalMatches}`}
      </p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {!showAll && (
          <div className="flex flex-wrap items-center gap-1.5">
            <Button
              aria-label="Previous page"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              Previous
            </Button>
            <ul className="flex flex-wrap items-center gap-1">
              {pageWindow(page, pageCount).map((entry, i) =>
                entry === "gap" ? (
                  <li key={`gap-${i}`} aria-hidden className="px-1 text-ink-soft">
                    …
                  </li>
                ) : (
                  <li key={entry}>
                    <button
                      type="button"
                      aria-label={`Page ${entry}`}
                      aria-current={entry === page ? "page" : undefined}
                      onClick={() => onPageChange(entry)}
                      className={clsx(
                        "min-w-9 rounded-lg px-2.5 py-2 text-[14px] font-semibold transition-colors",
                        entry === page
                          ? "bg-ink text-white"
                          : "text-ink-soft hover:bg-ink/5 hover:text-ink",
                      )}
                    >
                      {entry}
                    </button>
                  </li>
                ),
              )}
            </ul>
            <Button
              aria-label="Next page"
              disabled={page >= pageCount}
              onClick={() => onPageChange(page + 1)}
            >
              Next
            </Button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <label htmlFor={sizeId} className="text-[13px] font-semibold whitespace-nowrap text-ink">
            Show
          </label>
          <select
            id={sizeId}
            value={String(sizeChoice)}
            onChange={(e) =>
              onSizeChange(e.target.value === "all" ? "all" : Number(e.target.value))
            }
            className={`${inputClass} w-auto`}
          >
            {PAGE_SIZE_CHOICES.map((size) => (
              <option key={size} value={String(size)}>
                {size === "all" ? "Show all" : `${size} per page`}
              </option>
            ))}
          </select>
        </div>
      </div>
    </nav>
  );
}
