import { describe, expect, it } from "vitest";

import {
  buildChamadoInsert,
  buildVitimaInsert,
  canCreateChamadoFromDenuncia,
  denunciaHasVictimaInfo,
} from "./chamados";
import type { AdminDenuncia } from "./denuncias";

const baseDenuncia: AdminDenuncia = {
  id: "67837c5b-3fe7-438f-983c-7e5de1d563e6",
  motivo_id: "b0b8adfd-5fa8-4d4e-9b82-d8560f0bd1f0",
  status: "em_analise",
  relato: "Relato completo com detalhes suficientes para iniciar atendimento.",
  local_ocorrencia: "Bairro Centro",
  vitima_nome_informado: null,
  vitima_idade_informada: null,
  vitima_endereco_informado: null,
  observacoes_internas: null,
  created_at: "2026-07-14T10:00:00.000Z",
  updated_at: "2026-07-14T10:00:00.000Z",
  motivos_denuncia: { nome: "Negligencia" },
};

describe("chamado conversion helpers", () => {
  it("detects when denuncia has victim information", () => {
    expect(denunciaHasVictimaInfo(baseDenuncia)).toBe(false);
    expect(
      denunciaHasVictimaInfo({
        ...baseDenuncia,
        vitima_idade_informada: 12,
      })
    ).toBe(true);
  });

  it("builds a victim insert from optional denuncia fields", () => {
    expect(
      buildVitimaInsert({
        ...baseDenuncia,
        vitima_nome_informado: "Maria",
        vitima_idade_informada: 11,
        vitima_endereco_informado: "Rua A",
      })
    ).toEqual({
      nome: "Maria",
      idade_estimada: 11,
      endereco: "Rua A",
      observacoes: "Criada a partir da denuncia 67837c5b-3fe7-438f-983c-7e5de1d563e6.",
    });
  });

  it("builds chamado insert with counselor and optional victim", () => {
    expect(
      buildChamadoInsert({
        denuncia: baseDenuncia,
        conselheiroId: "1a15f124-3bd4-4c75-80fd-4d66a13383cf",
        vitimaId: "7d038101-408c-485d-9313-5d1dde32176d",
      })
    ).toEqual({
      denuncia_id: baseDenuncia.id,
      vitima_id: "7d038101-408c-485d-9313-5d1dde32176d",
      conselheiro_id: "1a15f124-3bd4-4c75-80fd-4d66a13383cf",
      status: "aberto",
      titulo: "Atendimento a partir de denuncia anonima",
      descricao: baseDenuncia.relato,
    });
  });

  it("blocks conversion when denuncia is already converted", () => {
    expect(canCreateChamadoFromDenuncia(baseDenuncia)).toBe(true);
    expect(
      canCreateChamadoFromDenuncia({
        ...baseDenuncia,
        status: "convertida_em_chamado",
      })
    ).toBe(false);
  });
});
