import { createHash, createHmac, timingSafeEqual } from "node:crypto";

// A session token is "<expiry>.<signature>". The signature is an HMAC of the expiry
// made with SESSION_SECRET, so nobody can forge or extend a token without the secret.

export const SESSION_COOKIE = "session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days, in seconds

const sign = (value: string, secret: string) => createHmac("sha256", secret).update(value).digest("base64url");

/** Compares in constant time, so response timing doesn't leak how much of a guess was right. */
function safeEqual(a: string, b: string) {
  const [x, y] = [a, b].map((s) => createHash("sha256").update(s).digest());
  return timingSafeEqual(x, y);
}

export function createToken(secret: string, now = Date.now()): string {
  const expires = String(now + SESSION_MAX_AGE * 1000);
  return `${expires}.${sign(expires, secret)}`;
}

export function verifyToken(token: string | undefined, secret: string, now = Date.now()): boolean {
  const [expires, signature] = token?.split(".") ?? [];
  if (!expires || !signature) return false;
  return safeEqual(signature, sign(expires, secret)) && Number(expires) > now;
}

export function passwordMatches(input: string, expected: string): boolean {
  return safeEqual(input, expected);
}

/** Reads a required auth env var, failing loudly instead of running unprotected. */
export function authEnv(name: "APP_PASSWORD" | "SESSION_SECRET"): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set. See .env.example.`);
  return value;
}
