import { describe, expect, it } from "vitest";

import {
  buildDenunciaAssignmentUpdate,
  buildDenunciaStatusGroups,
  canTransitionDenunciaStatus,
  parseDenunciaFilters,
} from "./denuncias";
import { buildOperationalStageGroups } from "./operational-flow";

describe("denuncias admin helpers", () => {
  it("allows only issue 10 triage transitions", () => {
    expect(canTransitionDenunciaStatus("recebida", "atribuida")).toBe(true);
    expect(canTransitionDenunciaStatus("atribuida", "em_analise")).toBe(true);
    expect(canTransitionDenunciaStatus("atribuida", "recebida")).toBe(true);
    expect(canTransitionDenunciaStatus("em_analise", "arquivada")).toBe(true);
    expect(canTransitionDenunciaStatus("arquivada", "em_analise")).toBe(true);

    expect(
      canTransitionDenunciaStatus("em_analise", "convertida_em_chamado")
    ).toBe(false);
    expect(canTransitionDenunciaStatus("recebida", "arquivada")).toBe(false);
    expect(canTransitionDenunciaStatus("recebida", "em_analise")).toBe(false);
  });

  it("parses denuncia filters from search params", () => {
    const filters = parseDenunciaFilters({
      status: "recebida",
      motivo_id: "b0b8adfd-5fa8-4d4e-9b82-d8560f0bd1f0",
      conselheiro_id: "550e8400-e29b-41d4-a716-446655440000",
      data_inicio: "2026-07-01",
      data_fim: "2026-07-14",
    });

    expect(filters).toEqual({
      status: "recebida",
      motivoId: "b0b8adfd-5fa8-4d4e-9b82-d8560f0bd1f0",
      conselheiroId: "550e8400-e29b-41d4-a716-446655440000",
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
        vitima_nome_pai_informado: null,
        vitima_nome_mae_informado: null,
        vitima_escola_informada: null,
        vitima_genero_informado: null,
        conselheiro_responsavel_id: null,
        profiles: null,
        observacoes_internas: null,
        motivos_denuncia: { nome: "Negligencia" },
      },
    ]);

    expect(groups.recebida).toHaveLength(1);
    expect(groups.atribuida).toEqual([]);
    expect(groups.em_analise).toEqual([]);
    expect(groups.convertida_em_chamado).toEqual([]);
    expect(groups.arquivada).toEqual([]);
  });

  it("groups converted denuncias by linked chamado operational stage", () => {
    const groups = buildOperationalStageGroups([
      {
        id: "1",
        created_at: "2026-07-14T10:00:00.000Z",
        updated_at: "2026-07-14T10:00:00.000Z",
        relato: "Relato convertido em chamado finalizado.",
        status: "convertida_em_chamado",
        motivo_id: "b0b8adfd-5fa8-4d4e-9b82-d8560f0bd1f0",
        local_ocorrencia: null,
        vitima_nome_informado: null,
        vitima_idade_informada: null,
        vitima_endereco_informado: null,
        vitima_nome_pai_informado: null,
        vitima_nome_mae_informado: null,
        vitima_escola_informada: null,
        vitima_genero_informado: null,
        conselheiro_responsavel_id: null,
        profiles: null,
        observacoes_internas: null,
        motivos_denuncia: { nome: "Negligencia" },
        chamados: [
          {
            id: "chamado-1",
            status: "finalizado",
            data_fechamento: "2026-07-15T03:51:00.000Z",
            chamado_medidas_protetivas: [],
            encaminhamentos: [],
          },
        ],
      },
    ]);

    expect(groups.finalizado).toHaveLength(1);
    expect(groups.em_analise).toEqual([]);
  });

  it("builds assignment update payload", () => {
    expect(
      buildDenunciaAssignmentUpdate("550e8400-e29b-41d4-a716-446655440000"),
    ).toEqual({
      conselheiro_responsavel_id: "550e8400-e29b-41d4-a716-446655440000",
      status: "atribuida",
    });
  });
});
