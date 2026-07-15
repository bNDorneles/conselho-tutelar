import { redirect } from "next/navigation";

import { requireAdminProfile } from "../auth/admin";
import { createServerSupabaseClient } from "../supabase/server";
import type { Database } from "../supabase/database.types";

export type DenunciaStatus = Database["public"]["Enums"]["denuncia_status"];
type AuditAction = Database["public"]["Enums"]["audit_action"];
type DenunciaRow = Database["public"]["Tables"]["denuncias"]["Row"];

export type AdminDenuncia = DenunciaRow & {
  motivos_denuncia: {
    nome: string;
  } | null;
};

export type DenunciaFilters = {
  status?: DenunciaStatus;
  motivoId?: string;
  dataInicio?: string;
  dataFim?: string;
};

export const denunciaStatusColumns: DenunciaStatus[] = [
  "recebida",
  "em_analise",
  "convertida_em_chamado",
  "arquivada",
];

export const denunciaStatusLabels: Record<DenunciaStatus, string> = {
  recebida: "Recebida",
  em_analise: "Em analise",
  convertida_em_chamado: "Convertida em chamado",
  arquivada: "Arquivada",
};

const allowedTransitions = new Set([
  "recebida:em_analise",
  "em_analise:recebida",
  "em_analise:arquivada",
  "arquivada:em_analise",
]);

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function isDenunciaStatus(value: string): value is DenunciaStatus {
  return denunciaStatusColumns.includes(value as DenunciaStatus);
}

function getSearchValue(
  input: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = input[key];

  return Array.isArray(value) ? value[0] : value;
}

export function canTransitionDenunciaStatus(
  from: DenunciaStatus,
  to: DenunciaStatus
) {
  return allowedTransitions.has(`${from}:${to}`);
}

export function parseDenunciaFilters(
  input: Record<string, string | string[] | undefined>
): DenunciaFilters {
  const status = getSearchValue(input, "status");
  const motivoId = getSearchValue(input, "motivo_id");
  const dataInicio = getSearchValue(input, "data_inicio");
  const dataFim = getSearchValue(input, "data_fim");
  const filters: DenunciaFilters = {};

  if (status && isDenunciaStatus(status)) {
    filters.status = status;
  }

  if (motivoId && uuidPattern.test(motivoId)) {
    filters.motivoId = motivoId;
  }

  if (dataInicio && datePattern.test(dataInicio)) {
    filters.dataInicio = dataInicio;
  }

  if (dataFim && datePattern.test(dataFim)) {
    filters.dataFim = dataFim;
  }

  return filters;
}

export function buildDenunciaStatusGroups(rows: AdminDenuncia[]) {
  const groups: Record<DenunciaStatus, AdminDenuncia[]> = {
    recebida: [],
    em_analise: [],
    convertida_em_chamado: [],
    arquivada: [],
  };

  for (const row of rows) {
    groups[row.status].push(row);
  }

  return groups;
}

async function insertAuditLog(args: {
  userId: string;
  action: AuditAction;
  entityId: string;
  metadata: Record<string, string | null>;
}) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("audit_logs").insert({
    actor_id: args.userId,
    action: args.action,
    entity_table: "denuncias",
    entity_id: args.entityId,
    metadata: args.metadata,
  });

  if (error) {
    throw new Error("Nao foi possivel registrar auditoria da denuncia.");
  }
}

export async function getAdminDenuncias(filters: DenunciaFilters) {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("denuncias")
    .select(
      "id,motivo_id,status,relato,local_ocorrencia,vitima_nome_informado,vitima_idade_informada,vitima_endereco_informado,observacoes_internas,created_at,updated_at,motivos_denuncia(nome)"
    )
    .order("created_at", { ascending: false });

  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  if (filters.motivoId) {
    query = query.eq("motivo_id", filters.motivoId);
  }

  if (filters.dataInicio) {
    query = query.gte("created_at", `${filters.dataInicio}T00:00:00.000Z`);
  }

  if (filters.dataFim) {
    query = query.lte("created_at", `${filters.dataFim}T23:59:59.999Z`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error("Nao foi possivel carregar as denuncias.");
  }

  return (data ?? []) as AdminDenuncia[];
}

export async function getAdminDenunciaDetail(id: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("denuncias")
    .select(
      "id,motivo_id,status,relato,local_ocorrencia,vitima_nome_informado,vitima_idade_informada,vitima_endereco_informado,observacoes_internas,created_at,updated_at,motivos_denuncia(nome)"
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error("Nao foi possivel carregar a denuncia.");
  }

  return data as AdminDenuncia | null;
}

export async function getMotivosDenunciaOptions() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("motivos_denuncia")
    .select("id,nome")
    .eq("ativo", true)
    .order("nome");

  if (error) {
    throw new Error("Nao foi possivel carregar os motivos de denuncia.");
  }

  return data ?? [];
}

export async function recordDenunciaRead(profileId: string, denunciaId: string) {
  await insertAuditLog({
    userId: profileId,
    action: "read",
    entityId: denunciaId,
    metadata: {
      origem: "admin_denuncia_detail",
    },
  });
}

export async function updateDenunciaStatusAction(formData: FormData) {
  "use server";

  const profile = await requireAdminProfile();
  const denunciaId = String(formData.get("denuncia_id") ?? "");
  const fromStatus = String(formData.get("from_status") ?? "");
  const toStatus = String(formData.get("to_status") ?? "");

  if (
    !uuidPattern.test(denunciaId) ||
    !isDenunciaStatus(fromStatus) ||
    !isDenunciaStatus(toStatus) ||
    !canTransitionDenunciaStatus(fromStatus, toStatus)
  ) {
    redirect("/admin/denuncias?error=transicao_invalida");
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("denuncias")
    .update({ status: toStatus })
    .eq("id", denunciaId)
    .eq("status", fromStatus);

  if (error) {
    redirect("/admin/denuncias?error=nao_foi_possivel_atualizar");
  }

  await insertAuditLog({
    userId: profile.id,
    action: "status_change",
    entityId: denunciaId,
    metadata: {
      origem: "admin_denuncias_kanban",
      status_anterior: fromStatus,
      status_novo: toStatus,
    },
  });

  redirect("/admin/denuncias");
}
