import { describe, expect, it } from "vitest";
import { parseFilters, toPrismaQuery, toQueryString } from "./filters";

describe("parseFilters", () => {
  it("defaults to newest first with no filters", () => {
    expect(parseFilters({})).toEqual({ sort: "createdAt", order: "desc" });
  });

  it("keeps valid values and drops invalid or empty ones", () => {
    const filters = parseFilters({
      status: "Applied",
      source: "",
      from: "not-a-date",
      to: "2026-11-30",
      sort: "dropTable",
      order: "asc",
    });
    expect(filters).toEqual({ status: "Applied", to: "2026-11-30", sort: "createdAt", order: "asc" });
  });

  it("ignores repeated query params (arrays)", () => {
    expect(parseFilters({ status: ["Applied", "Saved"] }).status).toBeUndefined();
  });
});

describe("toPrismaQuery", () => {
  it("builds where and orderBy from filters", () => {
    const query = toPrismaQuery(parseFilters({ status: "Offer", sort: "company", order: "asc" }));
    expect(query.where).toEqual({ status: "Offer", source: undefined, dateApplied: undefined });
    expect(query.orderBy).toEqual({ company: "asc" });
  });

  it("turns a date range into an inclusive dateApplied filter", () => {
    const query = toPrismaQuery(parseFilters({ from: "2026-11-01", to: "2026-11-07" }));
    expect(query.where.dateApplied).toEqual({
      gte: new Date("2026-11-01T00:00:00Z"),
      lte: new Date("2026-11-07T00:00:00Z"),
    });
  });
});

describe("toQueryString", () => {
  it("keeps current filters, applies overrides, and omits empty values", () => {
    const filters = parseFilters({ status: "Applied", sort: "company", order: "asc" });
    expect(toQueryString(filters, { order: "desc" })).toBe("?status=Applied&sort=company&order=desc");
  });
});
