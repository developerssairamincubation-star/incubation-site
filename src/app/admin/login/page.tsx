import type { Metadata } from "next";
import Image from "next/image";
import { connection } from "next/server";
import { getAdminConfig } from "@/lib/auth/config";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  // Read the admin env vars per request, not once at build time.
  await connection();
  const setup = getAdminConfig();

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-[400px] rounded-2xl border border-line/60 bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
        <Image
          src="/images/logo.png"
          alt="Sri Sairam Techno Incubator Foundation"
          width={158}
          height={58}
          priority
          className="h-12 w-auto"
        />
        <h1 className="mt-6 text-[22px] font-bold">Website admin</h1>
        <p className="mt-1 text-[14px] text-ink-soft">
          Sign in to update the site&rsquo;s photos, events, startups and team.
        </p>

        <div className="mt-6">
          {setup.ready ? (
            <LoginForm />
          ) : (
            <div className="rounded-lg bg-cream px-4 py-3 text-[14px] text-ink-soft">
              <p className="font-semibold text-ink">Admin sign-in isn&rsquo;t set up yet.</p>
              {/* Variable names only — and only in development. */}
              {process.env.NODE_ENV !== "production" && (
                <p className="mt-2">
                  Missing: <code className="text-[13px]">{setup.missing.join(", ")}</code>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
