"use client";

import { useActionState } from "react";
import { login } from "@/lib/auth/actions";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, {});

  return (
    <form action={formAction} className="space-y-3 rounded-lg border border-slate-200 bg-white p-6">
      <label htmlFor="password" className="block text-sm font-medium text-slate-700">
        Password
      </label>
      <input id="password" name="password" type="password" autoComplete="current-password" required autoFocus className="field" />
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button type="submit" disabled={isPending} className="btn-primary w-full">
        {isPending ? "Checking…" : "Log in"}
      </button>
    </form>
  );
}
