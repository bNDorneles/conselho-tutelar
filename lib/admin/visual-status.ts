import type { OperationalStage } from "./operational-flow";

export type AdminArea = "denuncias" | "chamados" | "cadastros" | "relatorios";
export type StatusTone = "success" | "warning" | "info" | "neutral" | "danger";

const areaAccents: Record<AdminArea, { label: string; className: string }> = {
  denuncias: {
    label: "Denuncias",
    className: "border-sky-200 bg-sky-50 text-sky-900",
  },
  chamados: {
    label: "Chamados",
    className: "border-emerald-200 bg-emerald-50 text-emerald-900",
  },
  cadastros: {
    label: "Cadastros",
    className: "border-amber-200 bg-amber-50 text-amber-900",
  },
  relatorios: {
    label: "Relatorios",
    className: "border-violet-200 bg-violet-50 text-violet-900",
  },
};

const toneClasses: Record<StatusTone, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  info: "border-sky-200 bg-sky-50 text-sky-800",
  neutral: "border-slate-200 bg-slate-50 text-slate-700",
  danger: "border-rose-200 bg-rose-50 text-rose-800",
};

const operationalStageTones: Record<OperationalStage, StatusTone> = {
  recebida: "info",
  atribuida: "info",
  em_analise: "warning",
  chamado_aberto: "warning",
  medida_aplicada: "success",
  encaminhamento: "success",
  finalizado: "success",
  arquivada: "neutral",
};

export function getAreaAccent(area: AdminArea) {
  return areaAccents[area];
}

export function getStatusToneClass(tone: StatusTone) {
  return toneClasses[tone];
}

export function getOperationalStageTone(stage: OperationalStage) {
  return operationalStageTones[stage];
}
