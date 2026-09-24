import Image from "next/image";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/auth/session";
import { logout } from "../actions";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  // Layouts don't re-render on every navigation, so each page also calls
  // requireAdmin() — this is just the first line of defence.
  await requireAdmin();

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-line/60 bg-white/90 backdrop-blur">
        <div className="flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-3 lg:px-10">
          <Link href="/admin" className="flex shrink-0 items-center gap-2.5">
            <Image
              src="/images/brand/sairam-institutions.webp"
              alt="Sairam Institutions"
              width={818}
              height={240}
              className="h-6 w-auto"
            />
            <span aria-hidden className="h-5 w-px bg-line/50" />
            <Image
              src="/images/logo.png"
              alt="Sri Sairam Techno Incubator Foundation"
              width={158}
              height={58}
              className="h-8 w-auto"
            />
          </Link>

          <div className="order-3 w-full lg:order-none lg:w-auto lg:flex-1">
            <AdminNav />
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg px-3 py-2 text-[14px] font-semibold text-ink-soft hover:bg-ink/5 hover:text-ink"
            >
              View site ↗
            </a>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-lg border border-line/80 bg-white px-3 py-2 text-[14px] font-semibold text-ink hover:border-ink/40"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1180px] px-5 py-8 pb-24">{children}</main>
    </>
  );
}
