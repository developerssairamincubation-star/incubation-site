import type { Metadata } from "next";
import { TeamEditor } from "@/components/admin/TeamEditor";
import { DatabaseRequired } from "@/components/admin/SetupNotice";
import { requireAdmin } from "@/lib/auth/session";
import { getSectionForEdit } from "@/lib/content/repository";
import { isDatabaseConfigured } from "@/lib/db";

export const metadata: Metadata = { title: "Team members" };

export default async function Page() {
  await requireAdmin();
  if (!isDatabaseConfigured()) return <DatabaseRequired />;
  const { data, version } = await getSectionForEdit("team");
  return <TeamEditor initial={data} version={version} />;
}
