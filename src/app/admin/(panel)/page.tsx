import { RecentChanges, type ChangeRow } from "@/components/admin/RecentChanges";
import { listAuditLog } from "@/lib/audit-log";
import { requireAdmin } from "@/lib/auth/session";
import type { ContentKey } from "@/lib/content/schema";

const SECTION_INFO: Record<ContentKey, { href: string; title: string }> = {
  hero: { href: "/admin/hero", title: "Hero images" },
  gallery: { href: "/admin/gallery", title: "Gallery events" },
  startups: { href: "/admin/startups", title: "Startup logos" },
  team: { href: "/admin/team", title: "Team members" },
};

// Fixed zone so the time reads the same for everyone, wherever the server runs.
const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kolkata",
});

export default async function AdminHome() {
  await requireAdmin();
  const entries = await listAuditLog();

  const rows: ChangeRow[] = entries.flatMap((entry) => {
    const info = SECTION_INFO[entry.section];
    if (!info) return [];
    return {
      id: entry.id,
      message: entry.message,
      sectionTitle: info.title,
      href: info.href,
      when: dateFormatter.format(entry.createdAt),
      iso: entry.createdAt.toISOString(),
    };
  });

  return (
    <div>
      <h1 className="text-[26px] font-bold">Website content</h1>
      <p className="mt-1.5 text-[15px] text-ink-soft">
        Changes go live on the site as soon as you save. Use the menu above to jump to
        a section.
      </p>

      <div className="mt-8">
        <RecentChanges rows={rows} />
      </div>
    </div>
  );
}
