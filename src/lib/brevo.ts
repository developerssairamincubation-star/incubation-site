import "server-only";

type Attachment = { name: string; content: string };

export class MailError extends Error {}

/** True once the Brevo API key and a verified sender address are set. */
export function isMailConfigured() {
  return Boolean(process.env.BREVO_API_KEY && process.env.BREVO_SENDER_EMAIL);
}

/** Sends a plain-text transactional email through Brevo's REST API. */
export async function sendMail({
  to,
  subject,
  text,
  replyTo,
  attachments,
}: {
  to: string[];
  subject: string;
  text: string;
  replyTo?: string;
  attachments?: Attachment[];
}) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY ?? "",
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: process.env.BREVO_SENDER_NAME || "Sairam Incubation Website",
      },
      to: to.map((email) => ({ email })),
      ...(replyTo ? { replyTo: { email: replyTo } } : {}),
      subject,
      textContent: text,
      ...(attachments?.length ? { attachment: attachments } : {}),
    }),
  });

  if (!res.ok) {
    console.error("Brevo send failed:", res.status, await res.text().catch(() => ""));
    throw new MailError("Brevo rejected the message.");
  }
}
