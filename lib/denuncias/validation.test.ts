import { describe, expect, it } from "vitest";

import { denunciaSchema } from "./validation";

describe("denunciaSchema", () => {
  it("accepts a valid anonymous complaint", () => {
    const result = denunciaSchema.safeParse({
      motivo_id: "550e8400-e29b-41d4-a716-446655440000",
      relato:
        "Relato com detalhes suficientes sobre uma situacao que exige avaliacao do Conselho Tutelar.",
      local_ocorrencia: "Bairro Centro",
      vitima_nome_informado: "Nome informado",
      vitima_idade_informada: "12",
      vitima_endereco_informado: "Endereco aproximado",
    });

    expect(result.success).toBe(true);
    expect(result.success && result.data.vitima_idade_informada).toBe(12);
  });

  it("rejects a short report", () => {
    const result = denunciaSchema.safeParse({
      motivo_id: "550e8400-e29b-41d4-a716-446655440000",
      relato: "curto",
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid child age", () => {
    const result = denunciaSchema.safeParse({
      motivo_id: "550e8400-e29b-41d4-a716-446655440000",
      relato:
        "Relato com detalhes suficientes sobre uma situacao que exige avaliacao do Conselho Tutelar.",
      vitima_idade_informada: "22",
    });

    expect(result.success).toBe(false);
  });
});

