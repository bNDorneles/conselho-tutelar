import { describe, expect, it } from "vitest";

import {
  buildCatalogItemUpdate,
  buildConselheiroProfileUpsert,
  buildConselhoUpdate,
  parseRequiredName,
} from "./cadastros";

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
      }),
    ).toEqual({
      nome: "Conselho Tutelar",
      municipio: "Sao Borja",
      uf: "RS",
      endereco: null,
      telefone: "(55) 99999-0000",
      email: null,
      horario_atendimento: null,
      whatsapp: null,
      facebook_url: null,
      instagram_url: null,
      mapa_url: null,
    });
  });

  it("builds a counselor profile linked to an existing auth user id", () => {
    expect(
      buildConselheiroProfileUpsert({
        id: "550e8400-e29b-41d4-a716-446655440000",
        nome: "Maria Conselheira",
        email: "maria@example.com",
        telefone_fixo: "(55) 3431-0000",
        telefone_plantao: "(55) 99999-0000",
        cargo: "Conselheira tutelar",
        foto_url: "https://example.com/foto.jpg",
        sobre: "Atua no atendimento familiar.",
        mandato: "",
        exibir_publico: "true",
      }),
    ).toEqual({
      id: "550e8400-e29b-41d4-a716-446655440000",
      nome: "Maria Conselheira",
      email: "maria@example.com",
      telefone: "(55) 99999-0000",
      telefone_fixo: "(55) 3431-0000",
      telefone_plantao: "(55) 99999-0000",
      cargo: "Conselheira tutelar",
      foto_url: "https://example.com/foto.jpg",
      sobre: "Atua no atendimento familiar.",
      mandato: "2024-2028",
      role: "conselheiro",
      ativo: true,
      exibir_publico: true,
    });
  });

  it("rejects invalid auth user ids when building counselor profiles", () => {
    expect(() =>
      buildConselheiroProfileUpsert({
        id: "sem-uuid",
        nome: "Maria",
        email: "maria@example.com",
      }),
    ).toThrow("usuario invalido");
  });

  it("builds catalog item update payload with required name and optional description", () => {
    expect(
      buildCatalogItemUpdate({
        nome: "  Violencia fisica  ",
        descricao: "  Caso de agressao  ",
      }),
    ).toEqual({
      nome: "Violencia fisica",
      descricao: "Caso de agressao",
    });

    expect(
      buildCatalogItemUpdate({
        nome: "Negligencia",
        descricao: "",
      }),
    ).toEqual({
      nome: "Negligencia",
      descricao: null,
    });
  });
});
