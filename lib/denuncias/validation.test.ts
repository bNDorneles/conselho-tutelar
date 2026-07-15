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
      vitima_nome_pai_informado: "Nome do pai",
      vitima_nome_mae_informado: "Nome da mae",
      vitima_escola_informada: "Escola Municipal",
      vitima_genero_informado: "feminino",
    });

    expect(result.success).toBe(true);
    expect(result.success && result.data.vitima_idade_informada).toBe(12);
    expect(result.success && result.data.vitima_genero_informado).toBe(
      "feminino"
    );
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

  it("rejects invalid informed gender", () => {
    const result = denunciaSchema.safeParse({
      motivo_id: "550e8400-e29b-41d4-a716-446655440000",
      relato:
        "Relato com detalhes suficientes sobre uma situacao que exige avaliacao do Conselho Tutelar.",
      vitima_genero_informado: "invalido",
    });

    expect(result.success).toBe(false);
  });

  it("turns empty optional gender into null", () => {
    const result = denunciaSchema.safeParse({
      motivo_id: "550e8400-e29b-41d4-a716-446655440000",
      relato:
        "Relato com detalhes suficientes sobre uma situacao que exige avaliacao do Conselho Tutelar.",
      vitima_genero_informado: "",
    });

    expect(result.success).toBe(true);
    expect(result.success && result.data.vitima_genero_informado).toBeNull();
  });
});

