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
