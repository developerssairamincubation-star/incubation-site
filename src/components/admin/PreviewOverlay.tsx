"use client";

import { useEffect, useState } from "react";
import { IntroProvider, useIntro } from "@/components/providers/IntroProvider";
import { Button } from "./ui";

/** Flips introDone true immediately so Hero's entrance animation isn't stuck hidden. */
function AutoFinishIntro() {
  const { finishIntro } = useIntro();
  useEffect(() => {
    finishIntro();
  }, [finishIntro]);
  return null;
}

/**
 * Renders the real public section component full-screen, fed with the
 * editor's current in-memory (unsaved) state — so "what you see is what
 * you'd get" without needing a second, hand-maintained preview renderer.
 */
export function PreviewOverlay({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-cream">
      <IntroProvider>
        <AutoFinishIntro />
        <div className="sticky top-0 z-[101] flex items-center justify-between gap-3 border-b border-line/60 bg-ink px-5 py-2.5 text-white">
          <p className="text-[13px] font-semibold">
            Previewing unsaved changes — this isn&apos;t live yet.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/30 px-4 py-2 text-[14px] font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
          >
            Close preview
          </button>
        </div>
        {children}
      </IntroProvider>
    </div>
  );
}

/**
 * Drop-in trigger for a section editor: renders a "Preview" button and,
 * once clicked, the full-screen overlay with the given (unsaved) content.
 */
export function PreviewButton({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Preview</Button>
      {open && <PreviewOverlay onClose={() => setOpen(false)}>{children}</PreviewOverlay>}
    </>
  );
}
