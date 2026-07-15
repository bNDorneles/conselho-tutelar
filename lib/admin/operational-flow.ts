import type { AdminDenuncia } from "./denuncia-types";

export type OperationalStage =
  | "recebida"
  | "atribuida"
  | "em_analise"
  | "chamado_aberto"
  | "medida_aplicada"
  | "encaminhamento"
  | "finalizado"
  | "arquivada";

export const operationalStageColumns: OperationalStage[] = [
  "recebida",
  "atribuida",
  "em_analise",
  "chamado_aberto",
  "medida_aplicada",
  "encaminhamento",
  "finalizado",
  "arquivada",
];

export const operationalStageLabels: Record<OperationalStage, string> = {
  recebida: "Recebida",
  atribuida: "Atribuida",
  em_analise: "Em analise",
  chamado_aberto: "Chamado aberto",
  medida_aplicada: "Medida protetiva",
  encaminhamento: "Encaminhamento",
  finalizado: "Finalizado",
  arquivada: "Arquivada",
};

export const operationalStageDescriptions: Record<OperationalStage, string> = {
  recebida: "Relato novo aguardando triagem inicial.",
  atribuida: "Relato ja direcionado para um conselheiro.",
  em_analise: "Conselheiro avaliando procedencia e dados.",
  chamado_aberto: "Atendimento formalizado a partir da denuncia.",
  medida_aplicada: "Chamado com medida protetiva registrada.",
  encaminhamento: "Atendimento encaminhado ou relatado.",
  finalizado: "Chamado encerrado no sistema.",
  arquivada: "Denuncia encerrada sem abertura de chamado.",
};

export function getDenunciaOperationalStage(
  denuncia: AdminDenuncia,
): OperationalStage {
  if (denuncia.status === "arquivada") {
    return "arquivada";
  }

  if (denuncia.status !== "convertida_em_chamado") {
    return denuncia.status;
  }

  const chamado = denuncia.chamados?.[0];

  if (!chamado) {
    return "chamado_aberto";
  }

  if (chamado.status === "finalizado") {
    return "finalizado";
  }

  if (chamado.encaminhamentos.length > 0) {
    return "encaminhamento";
  }

  if (chamado.chamado_medidas_protetivas.length > 0) {
    return "medida_aplicada";
  }

  return "chamado_aberto";
}

export function buildOperationalStageGroups(rows: AdminDenuncia[]) {
  const groups = Object.fromEntries(
    operationalStageColumns.map((stage) => [stage, [] as AdminDenuncia[]]),
  ) as Record<OperationalStage, AdminDenuncia[]>;

  for (const row of rows) {
    groups[getDenunciaOperationalStage(row)].push(row);
  }

  return groups;
}
