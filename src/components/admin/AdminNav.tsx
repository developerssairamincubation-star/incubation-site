"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/hero", label: "Hero images" },
  { href: "/admin/gallery", label: "Gallery events" },
  { href: "/admin/startups", label: "Startup logos" },
  { href: "/admin/team", label: "Team members" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin sections" className="flex flex-wrap gap-1">
      {LINKS.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={clsx(
              "rounded-lg px-3 py-2 text-[14px] font-semibold transition-colors",
              active ? "bg-ink text-white" : "text-ink-soft hover:bg-ink/5 hover:text-ink",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
