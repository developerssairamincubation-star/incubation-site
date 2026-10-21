import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { SITE } from "@/lib/data";
import { ApplyForm } from "@/components/apply/ApplyForm";
import ApplyHeaderClient from "@/components/apply/ApplyHeaderClient";

export const metadata: Metadata = {
  title: "Apply for incubation",
  description: "Apply for incubation, research collaboration or partnership at Sri Sairam Techno Incubator Foundation.",
};

export default function ApplyPage() {

  return (
    <main className="min-h-screen bg-cream">
      <ApplyHeaderClient showInstitutions />

      <div className="mx-auto max-w-[1728px] px-6 py-10 lg:px-10 lg:py-12">
        <Link href="/" className="inline-flex items-center gap-1">
          <span className="rounded-full bg-cream/70 px-1 py-2 mr-2">
            <ArrowIcon className="rotate-180 text-[18px]" />
          </span>
          <span className="text-[18px] font-semibold">Back</span>
          <span className="sr-only"> to home</span>
        </Link>
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
