import type { Metadata } from "next";
import { StartupsEditor } from "@/components/admin/StartupsEditor";
import { DatabaseRequired } from "@/components/admin/SetupNotice";
import { requireAdmin } from "@/lib/auth/session";
import { getSectionForEdit } from "@/lib/content/repository";
import { isDatabaseConfigured } from "@/lib/db";

export const metadata: Metadata = { title: "Startup logos" };

export default async function Page() {
  await requireAdmin();
  if (!isDatabaseConfigured()) return <DatabaseRequired />;
  const { data, version } = await getSectionForEdit("startups");
  return <StartupsEditor initial={data} version={version} />;
}
