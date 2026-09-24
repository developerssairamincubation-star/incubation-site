"use client";

export default function AdminError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="rounded-2xl border border-rust/30 bg-white p-8">
      <h1 className="text-[20px] font-bold">Couldn&rsquo;t load this section</h1>
      <p className="mt-2 text-[15px] text-ink-soft">
        The content database didn&rsquo;t respond. Nothing has been changed — try again in a
        moment.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-5 rounded-lg bg-ink px-4 py-2 text-[14px] font-semibold text-white"
      >
        Try again
      </button>
    </div>
  );
}
