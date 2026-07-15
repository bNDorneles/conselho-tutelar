import { describe, expect, it } from "vitest";

import {
  buildDenunciaStatusGroups,
  canTransitionDenunciaStatus,
  parseDenunciaFilters,
} from "./denuncias";

describe("denuncias admin helpers", () => {
  it("allows only issue 10 triage transitions", () => {
    expect(canTransitionDenunciaStatus("recebida", "em_analise")).toBe(true);
    expect(canTransitionDenunciaStatus("em_analise", "recebida")).toBe(true);
    expect(canTransitionDenunciaStatus("em_analise", "arquivada")).toBe(true);
    expect(canTransitionDenunciaStatus("arquivada", "em_analise")).toBe(true);

    expect(
      canTransitionDenunciaStatus("em_analise", "convertida_em_chamado")
    ).toBe(false);
    expect(canTransitionDenunciaStatus("recebida", "arquivada")).toBe(false);
  });

  it("parses denuncia filters from search params", () => {
    const filters = parseDenunciaFilters({
      status: "recebida",
      motivo_id: "b0b8adfd-5fa8-4d4e-9b82-d8560f0bd1f0",
      data_inicio: "2026-07-01",
      data_fim: "2026-07-14",
    });

    expect(filters).toEqual({
      status: "recebida",
      motivoId: "b0b8adfd-5fa8-4d4e-9b82-d8560f0bd1f0",
      dataInicio: "2026-07-01",
      dataFim: "2026-07-14",
    });
  });

  it("ignores invalid filter values", () => {
    const filters = parseDenunciaFilters({
      status: "convertida",
      motivo_id: "nao-e-uuid",
      data_inicio: "14/07/2026",
      data_fim: "depois",
    });

    expect(filters).toEqual({});
  });

  it("groups denuncias by status with empty columns", () => {
    const groups = buildDenunciaStatusGroups([
      {
        id: "1",
        created_at: "2026-07-14T10:00:00.000Z",
        updated_at: "2026-07-14T10:00:00.000Z",
        relato: "Relato recebido com detalhes suficientes.",
        status: "recebida",
        motivo_id: "b0b8adfd-5fa8-4d4e-9b82-d8560f0bd1f0",
        local_ocorrencia: null,
        vitima_nome_informado: null,
        vitima_idade_informada: null,
        vitima_endereco_informado: null,
        observacoes_internas: null,
        motivos_denuncia: { nome: "Negligencia" },
      },
    ]);

    expect(groups.recebida).toHaveLength(1);
    expect(groups.em_analise).toEqual([]);
    expect(groups.convertida_em_chamado).toEqual([]);
    expect(groups.arquivada).toEqual([]);
  });
});
