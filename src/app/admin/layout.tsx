import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · SSTIF admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#f4efe4] text-ink">{children}</div>;
}
