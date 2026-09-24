"use client";

import { useActionState } from "react";
import { login, type LoginState } from "../actions";

const inputClass =
  "w-full rounded-lg border border-line/70 bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/25";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="username" className="mb-1.5 block text-[13px] font-semibold">
          Username
        </label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          required
          defaultValue={state.username}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-[13px] font-semibold">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </div>
      {state.error && (
        <p role="alert" className="rounded-lg bg-rust/10 px-3.5 py-2.5 text-[14px] text-rust">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-ink px-4 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-ink/85 disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
