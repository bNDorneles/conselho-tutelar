import { describe, expect, it } from "vitest";

import { buildConselhoUpdate, parseRequiredName } from "./cadastros";

describe("cadastros admin helpers", () => {
  it("normalizes required names", () => {
    expect(parseRequiredName("  Negligencia  ")).toBe("Negligencia");
  });

  it("rejects blank names", () => {
    expect(() => parseRequiredName(" ")).toThrow("nome obrigatorio");
  });

  it("builds conselho update payload with optional fields", () => {
    expect(
      buildConselhoUpdate({
        nome: "Conselho Tutelar",
        municipio: "Sao Borja",
        uf: "RS",
        endereco: "",
        telefone: "(55) 99999-0000",
        email: "",
      })
    ).toEqual({
      nome: "Conselho Tutelar",
      municipio: "Sao Borja",
      uf: "RS",
      endereco: null,
      telefone: "(55) 99999-0000",
      email: null,
      horario_atendimento: null,
    });
  });
});
