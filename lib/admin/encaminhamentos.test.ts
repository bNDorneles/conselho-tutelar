import { describe, expect, it } from "vitest";

import { buildEncaminhamentoInsert, parseEncaminhamentoInput } from "./encaminhamentos";

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
});
