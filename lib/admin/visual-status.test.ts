import { describe, expect, it } from "vitest";

import {
  getAreaAccent,
  getOperationalStageTone,
  getStatusToneClass,
} from "./visual-status";

describe("admin visual status helpers", () => {
  it("assigns distinct accents to major admin areas", () => {
    expect(getAreaAccent("denuncias").label).toBe("Denuncias");
    expect(getAreaAccent("chamados").label).toBe("Chamados");
    expect(getAreaAccent("cadastros").label).toBe("Cadastros");
    expect(getAreaAccent("relatorios").label).toBe("Relatorios");
    expect(getAreaAccent("auditoria").label).toBe("Auditoria");
    expect(
      new Set([
        getAreaAccent("denuncias").className,
        getAreaAccent("chamados").className,
        getAreaAccent("cadastros").className,
        getAreaAccent("relatorios").className,
        getAreaAccent("auditoria").className,
      ]),
    ).toHaveLength(5);
  });

  it("maps operational stages to readable status tones", () => {
    expect(getOperationalStageTone("recebida")).toBe("info");
    expect(getOperationalStageTone("em_analise")).toBe("warning");
    expect(getOperationalStageTone("finalizado")).toBe("success");
    expect(getOperationalStageTone("arquivada")).toBe("neutral");
  });

  it("returns concrete classes for every tone used by statuses", () => {
    expect(getStatusToneClass("success")).toContain("text-emerald");
    expect(getStatusToneClass("warning")).toContain("text-amber");
    expect(getStatusToneClass("info")).toContain("text-sky");
    expect(getStatusToneClass("neutral")).toContain("text-slate");
  });
});
