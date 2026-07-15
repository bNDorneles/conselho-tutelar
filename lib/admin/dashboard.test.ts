import { describe, expect, it } from "vitest";

import { formatDashboardDate, getCountValue, summarizeText } from "./dashboard";

describe("dashboard helpers", () => {
  it("normalizes nullable Supabase counts", () => {
    expect(getCountValue(7)).toBe(7);
    expect(getCountValue(null)).toBe(0);
  });

  it("summarizes long text without breaking short text", () => {
    expect(summarizeText("Relato curto")).toBe("Relato curto");
    expect(summarizeText("A".repeat(90), 24)).toBe(`${"A".repeat(24)}...`);
  });

  it("formats dashboard dates in Brazilian Portuguese", () => {
    expect(formatDashboardDate("2026-07-14T18:30:00.000Z")).toBe(
      "14/07/2026, 15:30"
    );
  });
});
