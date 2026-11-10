import { describe, expect, it } from "vitest";
import { createToken, passwordMatches, SESSION_MAX_AGE, verifyToken } from "./token";

const secret = "test-secret";
const now = Date.UTC(2026, 10, 10);

describe("session tokens", () => {
  it("accepts a token it created", () => {
    expect(verifyToken(createToken(secret, now), secret, now)).toBe(true);
  });

  it("rejects a token signed with a different secret", () => {
    expect(verifyToken(createToken("other-secret", now), secret, now)).toBe(false);
  });

  it("rejects a token whose expiry was edited", () => {
    const [, signature] = createToken(secret, now).split(".");
    const extended = `${now + SESSION_MAX_AGE * 1000 * 10}.${signature}`;
    expect(verifyToken(extended, secret, now)).toBe(false);
  });

  it("rejects expired tokens", () => {
    const later = now + SESSION_MAX_AGE * 1000 + 1;
    expect(verifyToken(createToken(secret, now), secret, later)).toBe(false);
  });

  it("rejects missing or malformed tokens", () => {
    for (const token of [undefined, "", "garbage", ".", "123."]) {
      expect(verifyToken(token, secret, now)).toBe(false);
    }
  });
});

describe("passwordMatches", () => {
  it("matches only the exact password", () => {
    expect(passwordMatches("correct horse", "correct horse")).toBe(true);
    expect(passwordMatches("correct hors", "correct horse")).toBe(false);
    expect(passwordMatches("", "correct horse")).toBe(false);
  });
});
