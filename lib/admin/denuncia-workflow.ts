import type { Database } from "../supabase/database.types";

export type DenunciaStatus = Database["public"]["Enums"]["denuncia_status"];

export const denunciaStatusColumns: DenunciaStatus[] = [
  "recebida",
  "atribuida",
  "em_analise",
  "convertida_em_chamado",
  "arquivada",
];

export const denunciaStatusLabels: Record<DenunciaStatus, string> = {
  recebida: "Recebida",
  atribuida: "Atribuida",
  em_analise: "Em analise",
  convertida_em_chamado: "Convertida em chamado",
  arquivada: "Arquivada",
};

const allowedTransitions = new Set([
  "recebida:atribuida",
  "atribuida:em_analise",
  "atribuida:recebida",
  "em_analise:arquivada",
  "arquivada:em_analise",
]);

export function isDenunciaStatus(value: string): value is DenunciaStatus {
  return denunciaStatusColumns.includes(value as DenunciaStatus);
}

export function canTransitionDenunciaStatus(
  from: DenunciaStatus,
  to: DenunciaStatus,
) {
  return allowedTransitions.has(`${from}:${to}`);
}
