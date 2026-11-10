import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { authEnv, SESSION_COOKIE, verifyToken } from "./token";

/**
 * The real security check, called right before every database read or write.
 * proxy.ts redirects logged-out visitors early, but this guard protects the data
 * even if a request somehow skips the proxy.
 */
export async function requireSession() {
  await connection(); // the expiry check reads the clock, so always run it at request time
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!verifyToken(token, authEnv("SESSION_SECRET"))) redirect("/login");
}
