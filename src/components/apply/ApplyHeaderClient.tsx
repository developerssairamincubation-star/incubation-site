"use client";

import Image from "next/image";
import clsx from "clsx";
import React from "react";

export default function ApplyHeaderClient() {
  const introDone = true;

  function goTo(selector: string) {
    try {
      const el = document.querySelector(selector);
      if (el && typeof (el as Element).scrollIntoView === "function") {
        (el as Element).scrollIntoView({ behavior: "smooth" });
        return;
      }
    } catch (e) {}
    if (typeof window !== "undefined") window.location.hash = selector;
  }

  return (
    <header className="border-b border-line bg-cream/90 shadow-[0px_0px_13px_rgba(0,0,0,0.06)] backdrop-blur-sm">
      <div className="mx-auto flex h-[72px] max-w-[1728px] items-center justify-between px-6 lg:px-10">
        <button
          type="button"
          onClick={() => goTo("#home")}
          aria-label="Sri Sairam Techno Incubator Foundation — home"
        >
          <Image
            id="header-logo"
            src="/images/logo.png"
            alt="Sri Sairam Techno Incubator Foundation"
            width={158}
            height={58}
            priority
            className={clsx(
              "h-12 w-auto transition-opacity duration-500",
              introDone ? "opacity-100" : "opacity-0",
            )}
          />
        </button>
        <div />
      </div>
    </header>
  );
}
