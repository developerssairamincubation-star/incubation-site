import { APPLICATION_RECIPIENTS } from "@/lib/data";
import { isMailConfigured, sendMail } from "@/lib/brevo";

// Brevo caps transactional attachments at about 4 MB and Vercel caps request
// bodies at 4.5 MB, so keep the combined files comfortably under both.
const MAX_ATTACHMENT_BYTES = 3 * 1024 * 1024;
const ALLOWED_EXTENSIONS = /\.(pdf|docx?|pptx?|mp4|mov)$/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fail = (error: string, status: number) =>
  Response.json({ error }, { status });

export async function POST(request: Request) {
  if (!isMailConfigured()) {
    return fail("Online submission isn't set up yet. Please email us directly.", 503);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail("Couldn't read the submission.", 400);
  }

  const subject = String(form.get("subject") ?? "").trim().slice(0, 200);
  const body = String(form.get("body") ?? "").trim();
  const replyTo = String(form.get("replyTo") ?? "").trim();
  if (!subject || !body || body.length > 30_000) {
    return fail("The application looks empty or too long.", 400);
  }

  const files = form
    .getAll("attachments")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
  if (files.some((file) => !ALLOWED_EXTENSIONS.test(file.name))) {
    return fail("Attachments must be PDF, DOC/DOCX, PPT/PPTX, MP4 or MOV.", 400);
  }
  if (files.reduce((sum, file) => sum + file.size, 0) > MAX_ATTACHMENT_BYTES) {
    return fail("Attachments are too large — keep them under 3 MB in total.", 413);
  }

  const attachments = await Promise.all(
    files.map(async (file) => ({
      name: file.name.replace(/[^\w.\- ]+/g, "_"),
      content: Buffer.from(await file.arrayBuffer()).toString("base64"),
    })),
  );

  try {
    await sendMail({
      to: APPLICATION_RECIPIENTS,
      subject,
      text: body,
      replyTo: EMAIL_PATTERN.test(replyTo) ? replyTo : undefined,
      attachments,
    });
  } catch {
    return fail("We couldn't send your application. Please try again shortly.", 502);
  }

  return Response.json({ ok: true });
}
