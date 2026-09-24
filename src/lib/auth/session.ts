import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  isValidSessionToken,
  SESSION_COOKIE,
  SESSION_HOURS,
  signSessionToken,
} from "./token";

export async function createSession() {
  const token = await signSessionToken();
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    // Only ever sent to the admin — never on public page requests.
    path: "/admin",
    maxAge: SESSION_HOURS * 60 * 60,
  });
}

export async function deleteSession() {
  (await cookies()).delete({ name: SESSION_COOKIE, path: "/admin" });
}

/**
 * The real access check. proxy.ts only redirects early as a convenience;
 * every admin page and every admin server action must call this itself.
 */
export const requireAdmin = cache(async () => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!(await isValidSessionToken(token))) redirect("/admin/login");
});
