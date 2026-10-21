"use client";

import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

export default function ApplyHeaderClient({ showInstitutions = false }: { showInstitutions?: boolean }) {
  const introDone = true;

  return (
    <header className="border-b border-line bg-cream/90 shadow-[0px_0px_13px_rgba(0,0,0,0.06)] backdrop-blur-sm">
      <div className="mx-auto flex h-[72px] max-w-[1728px] items-center justify-between px-6 lg:px-10">
        <Link
          href="/"
          aria-label="Sri Sairam Techno Incubator Foundation — home"
          className={clsx(showInstitutions && "flex items-center gap-2.5 lg:gap-4")}
        >
          {showInstitutions ? (
            <>
              <Image
                src="/images/brand/sairam-institutions.webp"
                alt="Sairam Institutions"
                width={818}
                height={240}
                priority
                className="h-7 w-auto lg:h-9"
              />
              <span aria-hidden className="h-6 w-px bg-line/50 lg:h-8" />
            </>
          ) : null}
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
        </Link>
        <div />
      </div>
    </header>
  );
}
