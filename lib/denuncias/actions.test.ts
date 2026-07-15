import { describe, expect, it } from "vitest";

import { buildDenunciaInsertPayload } from "./payload";

describe("buildDenunciaInsertPayload", () => {
  it("maps the expanded anonymous complaint fields to the database payload", () => {
    const payload = buildDenunciaInsertPayload({
      motivo_id: "550e8400-e29b-41d4-a716-446655440000",
      relato:
        "Relato com detalhes suficientes sobre uma situacao que exige avaliacao do Conselho Tutelar.",
      local_ocorrencia: "Bairro Centro",
      vitima_nome_informado: "Nome informado",
      vitima_idade_informada: 12,
      vitima_endereco_informado: "Endereco aproximado",
      vitima_nome_pai_informado: "Nome do pai",
      vitima_nome_mae_informado: "Nome da mae",
      vitima_escola_informada: "Escola Municipal",
      vitima_genero_informado: "feminino",
    });

    expect(payload).toEqual({
      motivo_id: "550e8400-e29b-41d4-a716-446655440000",
      relato:
        "Relato com detalhes suficientes sobre uma situacao que exige avaliacao do Conselho Tutelar.",
      local_ocorrencia: "Bairro Centro",
      vitima_nome_informado: "Nome informado",
      vitima_idade_informada: 12,
      vitima_endereco_informado: "Endereco aproximado",
      vitima_nome_pai_informado: "Nome do pai",
      vitima_nome_mae_informado: "Nome da mae",
      vitima_escola_informada: "Escola Municipal",
      vitima_genero_informado: "feminino",
    });
  });
});
