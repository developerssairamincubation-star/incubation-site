import type { Metadata } from "next";
import { HeroEditor } from "@/components/admin/HeroEditor";
import { DatabaseRequired } from "@/components/admin/SetupNotice";
import { requireAdmin } from "@/lib/auth/session";
import { getSectionForEdit } from "@/lib/content/repository";
import { isDatabaseConfigured } from "@/lib/db";

export const metadata: Metadata = { title: "Hero images" };

export default async function Page() {
  await requireAdmin();
  if (!isDatabaseConfigured()) return <DatabaseRequired />;
  const { data, version } = await getSectionForEdit("hero");
  return <HeroEditor initial={data} version={version} />;
}
