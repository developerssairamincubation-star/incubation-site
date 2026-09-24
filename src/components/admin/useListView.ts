"use client";

import { useState } from "react";

export type SortMode = "none" | "asc" | "desc" | "newest" | "oldest";

/** How many items a page holds — a number, or everything at once. */
export type PageSizeChoice = number | "all";

export const PAGE_SIZE_CHOICES: PageSizeChoice[] = [5, 10, 25, "all"];

type Options<T> = {
  /** Page size to start with. */
  pageSize: number;
  /** Text a search query is matched against. Omit to turn search off. */
  getSearchText?: (item: T) => string;
  /** Value the list is ordered by when a sort is chosen. Omit to turn sort off. */
  getSortKey?: (item: T) => string;
  /** When each item was added (ms). Omit to turn the "recently added" sorts off. */
  getAddedAt?: (item: T) => number;
  /** Show everything regardless of page (e.g. while a hidden item has an error). */
  forceShowAll?: boolean;
};

/**
 * Search → sort → paginate over an editor's items. Every entry keeps its true
 * index in the full array (tagged before anything is filtered), so the
 * editor's move/remove/error lookups stay correct whatever is on screen.
 */
export function useListView<T>(
  items: T[],
  { pageSize: initialPageSize, getSearchText, getSortKey, getAddedAt, forceShowAll = false }: Options<T>,
) {
  const [query, setQueryState] = useState("");
  const [sort, setSortState] = useState<SortMode>("none");
  const [requestedPage, setRequestedPage] = useState(1);
  const [sizeChoice, setSizeChoice] = useState<PageSizeChoice>(initialPageSize);

  const needle = query.trim().toLowerCase();
  let matches = items.map((item, index) => ({ item, index }));

  if (needle && getSearchText) {
    matches = matches.filter(({ item }) => getSearchText(item).toLowerCase().includes(needle));
  }

  if ((sort === "asc" || sort === "desc") && getSortKey) {
    const direction = sort === "asc" ? 1 : -1;
    matches = [...matches].sort(
      (a, b) =>
        direction *
        getSortKey(a.item).localeCompare(getSortKey(b.item), undefined, {
          sensitivity: "base",
          numeric: true,
        }),
    );
  } else if ((sort === "newest" || sort === "oldest") && getAddedAt) {
    const direction = sort === "newest" ? -1 : 1;
    // Items added before dates were recorded tie at 0; their position in the
    // list (later = added later) settles the order among them.
    matches = [...matches].sort(
      (a, b) => direction * (getAddedAt(a.item) - getAddedAt(b.item) || a.index - b.index),
    );
  }

  const showAll = sizeChoice === "all" || forceShowAll;
  const pageSize = sizeChoice === "all" ? Math.max(1, matches.length) : sizeChoice;
  const pageCount = Math.max(1, Math.ceil(matches.length / pageSize));
  // Derived rather than synced with an effect, so deleting items or narrowing
  // a search can never leave the list on a page that no longer exists.
  const page = Math.min(requestedPage, pageCount);
  const entries = showAll ? matches : matches.slice((page - 1) * pageSize, page * pageSize);

  const filterActive = needle !== "" || sort !== "none";
  // Moving an item up or down only means something in the full, unfiltered,
  // manually ordered list.
  const canReorder = !filterActive && (showAll || pageCount === 1);
  const reorderHint = canReorder
    ? null
    : filterActive
      ? ""
      : "";

  return {
    entries,
    query,
    setQuery: (value: string) => {
      setQueryState(value);
      setRequestedPage(1);
    },
    sort,
    setSort: (value: SortMode) => {
      setSortState(value);
      setRequestedPage(1);
    },
    page,
    setPage: (value: number) => setRequestedPage(Math.min(Math.max(1, value), pageCount)),
    pageCount,
    pageSize,
    showAll,
    sizeChoice,
    setSizeChoice: (value: PageSizeChoice) => {
      setSizeChoice(value);
      setRequestedPage(1);
    },
    canReorder,
    reorderHint,
    filterActive,
    totalMatches: matches.length,
    totalItems: items.length,
    /** Clears search and sort and jumps to where a just-added item landed. */
    reveal: (where: "first" | "last") => {
      setQueryState("");
      setSortState("none");
      setRequestedPage(where === "first" ? 1 : Number.MAX_SAFE_INTEGER);
    },
  };
}

export type ListView<T> = ReturnType<typeof useListView<T>>;
