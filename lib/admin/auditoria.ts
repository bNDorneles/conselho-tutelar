import { createServerSupabaseClient } from "../supabase/server";
import type { Database, Json } from "../supabase/database.types";

export type AuditAction = Database["public"]["Enums"]["audit_action"];
export type AuditFilters = {
  action?: AuditAction;
  entityTable?: string;
  actorId?: string;
  dataInicio?: string;
  dataFim?: string;
};

export type AdminAuditLog = Database["public"]["Tables"]["audit_logs"]["Row"] & {
  profiles: {
    nome: string;
    email: string | null;
  } | null;
};

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const auditActions: AuditAction[] = [
  "create",
  "read",
  "update",
  "status_change",
  "delete",
];

const actionLabels: Record<AuditAction, string> = {
  create: "Criacao",
  read: "Leitura",
  update: "Atualizacao",
  status_change: "Mudanca de status",
  delete: "Exclusao",
};

const entityLabels: Record<string, string> = {
  audit_logs: "Auditoria",
  chamados: "Chamado",
  chamado_medidas_protetivas: "Medida do chamado",
  conselho_tutelar: "Conselho",
  denuncias: "Denuncia",
  encaminhamentos: "Encaminhamento",
  medidas_protetivas: "Medida protetiva",
  motivos_denuncia: "Motivo de denuncia",
  profiles: "Perfil",
};

function getSearchValue(
  input: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = input[key];

  return Array.isArray(value) ? value[0] : value;
}

export function isAuditAction(value: string): value is AuditAction {
  return auditActions.includes(value as AuditAction);
}

export function parseAuditFilters(
  input: Record<string, string | string[] | undefined>,
): AuditFilters {
  const action = getSearchValue(input, "action");
  const entityTable = getSearchValue(input, "entity_table");
  const actorId = getSearchValue(input, "actor_id");
  const dataInicio = getSearchValue(input, "data_inicio");
  const dataFim = getSearchValue(input, "data_fim");
  const filters: AuditFilters = {};

  if (action && isAuditAction(action)) {
    filters.action = action;
  }

  if (entityTable?.trim()) {
    filters.entityTable = entityTable.trim();
  }

  if (actorId?.trim()) {
    filters.actorId = actorId.trim();
  }

  if (dataInicio && datePattern.test(dataInicio)) {
    filters.dataInicio = dataInicio;
  }

  if (dataFim && datePattern.test(dataFim)) {
    filters.dataFim = dataFim;
  }

  return filters;
}

export function formatAuditAction(action: AuditAction) {
  return actionLabels[action];
}

export function formatAuditEntity(entityTable: string) {
  return entityLabels[entityTable] ?? entityTable;
}

function metadataValue(metadata: Json, key: string) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return null;
  }

  const value = metadata[key];

  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function summarizeAuditMetadata(metadata: Json) {
  const fromStatus = metadataValue(metadata, "status_anterior");
  const toStatus = metadataValue(metadata, "status_novo");
  const origem = metadataValue(metadata, "origem");
  const destino = metadataValue(metadata, "destino");
  const hasAssignment = Boolean(metadataValue(metadata, "conselheiro_responsavel_id"));
  const parts: string[] = [];

  if (fromStatus && toStatus) {
    parts.push(`Status: ${fromStatus} -> ${toStatus}`);
  } else if (toStatus) {
    parts.push(`Status novo: ${toStatus}.`);
  }

  if (hasAssignment) {
    parts.push("Conselheiro vinculado.");
  }

  if (destino) {
    parts.push(`Destino: ${destino}.`);
  }

  if (parts.length === 0 && origem) {
    parts.push(`Origem: ${origem}.`);
  }

  return parts.length > 0 ? parts.join(" ") : "Sem detalhes adicionais.";
}

export async function getAuditActorOptions() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id,nome")
    .eq("ativo", true)
    .order("nome");

  if (error) {
    throw new Error("Nao foi possivel carregar os responsaveis da auditoria.");
  }

  return data ?? [];
}

export async function getAdminAuditLogs(filters: AuditFilters = {}) {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("audit_logs")
    .select("id,actor_id,action,entity_table,entity_id,metadata,created_at,profiles(nome,email)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (filters.action) {
    query = query.eq("action", filters.action);
  }

  if (filters.entityTable) {
    query = query.eq("entity_table", filters.entityTable);
  }

  if (filters.actorId) {
    query = query.eq("actor_id", filters.actorId);
  }

  if (filters.dataInicio) {
    query = query.gte("created_at", `${filters.dataInicio}T00:00:00.000Z`);
  }

  if (filters.dataFim) {
    query = query.lte("created_at", `${filters.dataFim}T23:59:59.999Z`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error("Nao foi possivel carregar a auditoria.");
  }

  return (data ?? []) as AdminAuditLog[];
}

export async function getDenunciaAuditLogs(denunciaId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("audit_logs")
    .select("id,actor_id,action,entity_table,entity_id,metadata,created_at,profiles(nome,email)")
    .eq("entity_table", "denuncias")
    .eq("entity_id", denunciaId)
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) {
    throw new Error("Nao foi possivel carregar o historico da denuncia.");
  }

  return (data ?? []) as AdminAuditLog[];
}
