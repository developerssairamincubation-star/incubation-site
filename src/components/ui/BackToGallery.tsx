"use client";

import { useRouter } from "next/navigation";
import { GALLERY_RETURN_KEY } from "@/lib/lenis";
import { ArrowIcon } from "@/components/ui/ArrowIcon";

export default function BackToGallery() {
  const router = useRouter();

  const go = () => {
    // The gallery section restores its own scroll position and animation
    // state when it mounts and finds this flag — scrolling from here would
    // race ScrollTrigger's pin setup and land on the hero instead.
    sessionStorage.setItem(GALLERY_RETURN_KEY, "1");
    router.push("/");
  };

  return (
    <button
      type="button"
      onClick={go}
      className="flex items-center gap-2 rounded-full border border-white/70 bg-cream/70 px-3 py-2 shadow-[0px_10px_30px_rgba(0,0,0,0.05)] transition-colors hover:bg-cream"
    >
      <ArrowIcon className="rotate-180 text-[18px]" />
      <span className="text-sm font-medium">Back</span>
    </button>
  );
}
