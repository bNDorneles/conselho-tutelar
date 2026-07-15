import { describe, expect, it } from "vitest";

import {
  buildOperationalStageGroups,
  getDenunciaOperationalStage,
  operationalStageLabels,
} from "./operational-flow";
import type { AdminDenuncia } from "./denuncia-types";

const baseDenuncia: AdminDenuncia = {
  id: "67837c5b-3fe7-438f-983c-7e5de1d563e6",
  motivo_id: "b0b8adfd-5fa8-4d4e-9b82-d8560f0bd1f0",
  status: "recebida",
  relato: "Relato completo com detalhes suficientes.",
  local_ocorrencia: null,
  vitima_nome_informado: null,
  vitima_idade_informada: null,
  vitima_endereco_informado: null,
  vitima_nome_pai_informado: null,
  vitima_nome_mae_informado: null,
  vitima_escola_informada: null,
  vitima_genero_informado: null,
  conselheiro_responsavel_id: null,
  observacoes_internas: null,
  created_at: "2026-07-14T10:00:00.000Z",
  updated_at: "2026-07-14T10:00:00.000Z",
  motivos_denuncia: { nome: "Negligencia" },
  profiles: null,
  chamados: [],
};

describe("operational flow helpers", () => {
  it("maps raw denuncia statuses to initial operational stages", () => {
    expect(getDenunciaOperationalStage(baseDenuncia)).toBe("recebida");
    expect(
      getDenunciaOperationalStage({ ...baseDenuncia, status: "atribuida" }),
    ).toBe("atribuida");
    expect(
      getDenunciaOperationalStage({ ...baseDenuncia, status: "em_analise" }),
    ).toBe("em_analise");
    expect(
      getDenunciaOperationalStage({ ...baseDenuncia, status: "arquivada" }),
    ).toBe("arquivada");
  });

  it("derives chamado stages after denuncia conversion", () => {
    expect(
      getDenunciaOperationalStage({
        ...baseDenuncia,
        status: "convertida_em_chamado",
        chamados: [
          {
            id: "chamado-1",
            status: "aberto",
            data_fechamento: null,
            chamado_medidas_protetivas: [],
            encaminhamentos: [],
          },
        ],
      }),
    ).toBe("chamado_aberto");

    expect(
      getDenunciaOperationalStage({
        ...baseDenuncia,
        status: "convertida_em_chamado",
        chamados: [
          {
            id: "chamado-1",
            status: "em_atendimento",
            data_fechamento: null,
            chamado_medidas_protetivas: [{ id: "medida-1" }],
            encaminhamentos: [],
          },
        ],
      }),
    ).toBe("medida_aplicada");

    expect(
      getDenunciaOperationalStage({
        ...baseDenuncia,
        status: "convertida_em_chamado",
        chamados: [
          {
            id: "chamado-1",
            status: "em_atendimento",
            data_fechamento: null,
            chamado_medidas_protetivas: [{ id: "medida-1" }],
            encaminhamentos: [{ id: "encaminhamento-1" }],
          },
        ],
      }),
    ).toBe("encaminhamento");

    expect(
      getDenunciaOperationalStage({
        ...baseDenuncia,
        status: "convertida_em_chamado",
        chamados: [
          {
            id: "chamado-1",
            status: "finalizado",
            data_fechamento: "2026-07-15T03:51:00.000Z",
            chamado_medidas_protetivas: [],
            encaminhamentos: [],
          },
        ],
      }),
    ).toBe("finalizado");
  });

  it("groups denuncias by derived operational stage with every column present", () => {
    const groups = buildOperationalStageGroups([
      baseDenuncia,
      {
        ...baseDenuncia,
        id: "converted",
        status: "convertida_em_chamado",
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

    expect(groups.recebida).toHaveLength(1);
    expect(groups.finalizado).toHaveLength(1);
    expect(groups.em_analise).toEqual([]);
    expect(operationalStageLabels.finalizado).toBe("Finalizado");
  });
});
