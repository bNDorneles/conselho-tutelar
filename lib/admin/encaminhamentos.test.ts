import { describe, expect, it } from "vitest";

import {
  buildChamadoMedidaInsert,
  buildEncaminhamentoInsert,
  parseChamadoMedidaInput,
  parseEncaminhamentoInput,
} from "./encaminhamentos";

describe("encaminhamentos helpers", () => {
  it("parses valid encaminhamento input", () => {
    expect(
      parseEncaminhamentoInput({
        chamado_id: "67837c5b-3fe7-438f-983c-7e5de1d563e6",
        medida_protetiva_id: "1a15f124-3bd4-4c75-80fd-4d66a13383cf",
        descricao: "Encaminhado para acompanhamento psicossocial.",
        orgao_destino: "CRAS",
        data_encaminhamento: "2026-07-14T15:00",
      })
    ).toEqual({
      chamadoId: "67837c5b-3fe7-438f-983c-7e5de1d563e6",
      medidaProtetivaId: "1a15f124-3bd4-4c75-80fd-4d66a13383cf",
      descricao: "Encaminhado para acompanhamento psicossocial.",
      orgaoDestino: "CRAS",
      dataEncaminhamento: "2026-07-14T15:00",
    });
  });

  it("rejects blank description", () => {
    expect(() =>
      parseEncaminhamentoInput({
        chamado_id: "67837c5b-3fe7-438f-983c-7e5de1d563e6",
        descricao: " ",
      })
    ).toThrow("descricao obrigatoria");
  });

  it("builds insert payload with authenticated responsible user", () => {
    const input = parseEncaminhamentoInput({
      chamado_id: "67837c5b-3fe7-438f-983c-7e5de1d563e6",
      descricao: "Encaminhamento registrado.",
      orgao_destino: "",
      data_encaminhamento: "",
    });

    expect(
      buildEncaminhamentoInsert({
        input,
        responsavelId: "1a15f124-3bd4-4c75-80fd-4d66a13383cf",
      })
    ).toEqual({
      chamado_id: "67837c5b-3fe7-438f-983c-7e5de1d563e6",
      medida_protetiva_id: null,
      responsavel_id: "1a15f124-3bd4-4c75-80fd-4d66a13383cf",
      descricao: "Encaminhamento registrado.",
      orgao_destino: null,
    });
  });

  it("parses protective measure application input", () => {
    expect(
      parseChamadoMedidaInput({
        chamado_id: "67837c5b-3fe7-438f-983c-7e5de1d563e6",
        medida_protetiva_id: "1a15f124-3bd4-4c75-80fd-4d66a13383cf",
        observacoes: "Aplicada durante atendimento inicial.",
      }),
    ).toEqual({
      chamadoId: "67837c5b-3fe7-438f-983c-7e5de1d563e6",
      medidaProtetivaId: "1a15f124-3bd4-4c75-80fd-4d66a13383cf",
      observacoes: "Aplicada durante atendimento inicial.",
    });
  });

  it("builds protective measure application payload", () => {
    const input = parseChamadoMedidaInput({
      chamado_id: "67837c5b-3fe7-438f-983c-7e5de1d563e6",
      medida_protetiva_id: "1a15f124-3bd4-4c75-80fd-4d66a13383cf",
      observacoes: "",
    });

    expect(
      buildChamadoMedidaInsert({
        input,
        responsavelId: "550e8400-e29b-41d4-a716-446655440000",
      }),
    ).toEqual({
      chamado_id: "67837c5b-3fe7-438f-983c-7e5de1d563e6",
      medida_protetiva_id: "1a15f124-3bd4-4c75-80fd-4d66a13383cf",
      responsavel_id: "550e8400-e29b-41d4-a716-446655440000",
      observacoes: null,
    });
  });
});
