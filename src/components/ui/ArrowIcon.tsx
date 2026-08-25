import clsx from "clsx";

/** Filled chevron used across buttons and the gallery arrows. */
export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 20"
      fill="none"
      aria-hidden
      className={clsx("h-[1em] w-auto", className)}
    >
      <path d="M2 2l8 8-8 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
