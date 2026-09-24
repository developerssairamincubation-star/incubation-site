import type { Metadata } from "next";
import { GalleryEditor } from "@/components/admin/GalleryEditor";
import { DatabaseRequired } from "@/components/admin/SetupNotice";
import { requireAdmin } from "@/lib/auth/session";
import { getSectionForEdit } from "@/lib/content/repository";
import { isDatabaseConfigured } from "@/lib/db";

export const metadata: Metadata = { title: "Gallery events" };

export default async function Page() {
  await requireAdmin();
  if (!isDatabaseConfigured()) return <DatabaseRequired />;
  const { data, version } = await getSectionForEdit("gallery");
  return <GalleryEditor initial={data} version={version} />;
}
