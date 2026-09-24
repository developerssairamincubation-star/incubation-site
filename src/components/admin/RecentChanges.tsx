"use client";

import Link from "next/link";
import { Pagination } from "./ui";
import { useListView } from "./useListView";

export type ChangeRow = {
  id: number;
  message: string;
  sectionTitle: string;
  href: string;
  /** Already formatted on the server so it can't differ between server and browser. */
  when: string;
  iso: string;
};

const PAGE_SIZE = 5;

export function RecentChanges({ rows }: { rows: ChangeRow[] }) {
  const view = useListView(rows, { pageSize: PAGE_SIZE });

  return (
    <section
      aria-labelledby="recent-changes-heading"
      className="rounded-2xl border border-line/60 bg-white p-6"
    >
      <h2 id="recent-changes-heading" className="text-[16px] font-bold">
        Recent changes
      </h2>

      {rows.length === 0 ? (
        <p className="mt-3 text-[14px] text-ink-soft">
          Nothing has been changed yet — edits will appear here once a section is saved.
        </p>
      ) : (
        <>
          <Pagination
            label="Recent changes pages"
            page={view.page}
            pageCount={view.pageCount}
            pageSize={view.pageSize}
            sizeChoice={view.showAll ? "all" : view.sizeChoice}
            totalMatches={view.totalMatches}
            onPageChange={view.setPage}
            onSizeChange={view.setSizeChoice}
          />

          <ul className="mt-4 divide-y divide-line/50">
            {view.entries.map(({ item: row }) => (
              <li key={row.id}>
                <Link
                  href={row.href}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3.5 transition-colors hover:text-gold"
                >
                  <span>
                    <span className="font-semibold text-ink">{row.message}</span>
                    <span className="ml-2 text-[13px] text-ink-soft">in {row.sectionTitle}</span>
                  </span>
                  <time dateTime={row.iso} className="shrink-0 text-[13px] text-ink-soft">
                    {row.when}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
