import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/data";
import { ApplyForm } from "@/components/apply/ApplyForm";

export const metadata: Metadata = {
  title: "Apply for incubation",
  description: "Apply for incubation, research collaboration or partnership at Sri Sairam Techno Incubator Foundation.",
};

export default function ApplyPage() {
  return (
    <main className="min-h-screen bg-cream">
      <header className="border-b border-line bg-cream/90 shadow-[0px_0px_13px_rgba(0,0,0,0.06)] backdrop-blur-sm">
        <div className="mx-auto flex h-[72px] max-w-[1728px] items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-3 text-[15px] font-medium text-ink-soft uppercase">
            <span className="size-3 bg-gold" aria-hidden />
            <span>
              {SITE.name} <span className="text-ink-soft/60">/ Apply</span>
            </span>
          </div>
          <Link
            href="/"
            className="text-[13px] font-medium tracking-[0.2em] text-ink-soft uppercase transition-colors hover:text-ink"
          >
            ← Back to home
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1728px] px-6 py-10 lg:px-10 lg:py-12">
        <p className="text-[13px] font-medium tracking-[0.2em] text-gold uppercase">
          Cohort 2026 · Applications open · Reviewed quarterly
        </p>
        <h1 className="mt-4 font-bold text-[clamp(34px,3.8vw,58px)] leading-[1.08] text-ink">
          Apply for incubation
        </h1>
        <p className="mt-4 max-w-[760px] text-[17px] leading-relaxed text-ink-soft md:text-[19px]">
          Make your application count - the panel shortlists specifics, not buzzwords. Use the track selectors below to switch between student, startup and partnership paths.
        </p>
      </div>

      <ApplyForm />
    </main>
  );
}
