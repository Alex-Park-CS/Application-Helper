import { describe, expect, it } from "vitest";
import type { Application } from "@/generated/prisma/client";
import { applicationSchema, toFormValues } from "./schema";

const minimal = { company: "Acme", roleTitle: "Junior Developer", source: "LinkedIn", status: "Saved" };

describe("applicationSchema", () => {
  it("accepts the minimal required fields and stores empty optionals as null", () => {
    const result = applicationSchema.parse({ ...minimal, location: "", notes: "   " });
    expect(result).toMatchObject({ company: "Acme", location: null, notes: null, dateApplied: null });
  });

  it("trims text and requires company and role title", () => {
    const result = applicationSchema.safeParse({ ...minimal, company: "  ", roleTitle: " Dev " });
    expect(result.success).toBe(false);
    expect(result.error?.issues.map((i) => i.path[0])).toEqual(["company"]);
  });

  it("parses date inputs as UTC midnight", () => {
    const result = applicationSchema.parse({ ...minimal, dateApplied: "2026-11-10" });
    expect(result.dateApplied?.toISOString()).toBe("2026-11-10T00:00:00.000Z");
  });

  it("rejects invalid dates", () => {
    expect(applicationSchema.safeParse({ ...minimal, dateFound: "2026-13-45" }).success).toBe(false);
  });

  it("accepts http(s) URLs and rejects others, like javascript:", () => {
    expect(applicationSchema.parse({ ...minimal, jobUrl: "https://acme.dev/jobs/1" }).jobUrl).toBe(
      "https://acme.dev/jobs/1",
    );
    expect(applicationSchema.safeParse({ ...minimal, jobUrl: "javascript:alert(1)" }).success).toBe(false);
    expect(applicationSchema.safeParse({ ...minimal, jobUrl: "not a url" }).success).toBe(false);
  });

  it("rejects unknown status and source values", () => {
    expect(applicationSchema.safeParse({ ...minimal, status: "Hired!" }).success).toBe(false);
    expect(applicationSchema.safeParse({ ...minimal, source: "Craigslist" }).success).toBe(false);
  });
});

describe("toFormValues", () => {
  it("round-trips a saved row back through the schema unchanged", () => {
    const data = {
      company: "Acme",
      roleTitle: "Junior Developer",
      jobUrl: "https://acme.dev/jobs/1",
      location: null,
      source: "Referral",
      status: "Applied",
      dateFound: new Date("2026-11-01T00:00:00Z"),
      dateApplied: new Date("2026-11-03T00:00:00Z"),
      followUpDate: null,
      resumeVersion: "v1",
      contactName: null,
      contactInfo: null,
      jobDescription: null,
      notes: null,
    };
    const row: Application = { ...data, id: 1, createdAt: new Date(), updatedAt: new Date() };
    const values = toFormValues(row);
    expect(values.dateApplied).toBe("2026-11-03");
    expect(values).not.toHaveProperty("id");

    expect(applicationSchema.parse(values)).toEqual(data);
  });
});
