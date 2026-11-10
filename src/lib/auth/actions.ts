"use server";

import { setTimeout as sleep } from "node:timers/promises";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authEnv, createToken, passwordMatches, SESSION_COOKIE, SESSION_MAX_AGE } from "./token";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  if (!passwordMatches(password, authEnv("APP_PASSWORD"))) {
    await sleep(1000); // slows down password guessing
    return { error: "Wrong password." };
  }

  (await cookies()).set(SESSION_COOKIE, createToken(authEnv("SESSION_SECRET")), {
    httpOnly: true, // page scripts can't read it
    secure: process.env.NODE_ENV === "production", // HTTPS only once deployed
    sameSite: "lax", // not sent on requests from other sites
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
  redirect("/");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}
