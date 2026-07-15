import { describe, expect, it } from "vitest";

import {
  calculatePercent,
  countByLabel,
  parseReportFilters,
} from "./relatorios";

describe("relatorios helpers", () => {
  it("parses valid period filters", () => {
    expect(
      parseReportFilters({
        data_inicio: "2026-07-01",
        data_fim: "2026-07-14",
      })
    ).toEqual({
      dataInicio: "2026-07-01",
      dataFim: "2026-07-14",
    });
  });

  it("ignores invalid period filters", () => {
    expect(
      parseReportFilters({
        data_inicio: "01/07/2026",
        data_fim: "depois",
      })
    ).toEqual({});
  });

  it("counts rows by label and sorts descending", () => {
    expect(
      countByLabel([
        { label: "Negligencia" },
        { label: "Violencia" },
        { label: "Negligencia" },
      ])
    ).toEqual([
      { label: "Negligencia", total: 2 },
      { label: "Violencia", total: 1 },
    ]);
  });

  it("calculates bar percentages safely", () => {
    expect(calculatePercent(2, 4)).toBe(50);
    expect(calculatePercent(2, 0)).toBe(0);
  });
});
