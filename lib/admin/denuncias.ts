import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { requireAdminProfile } from "../auth/admin";
import { createServerSupabaseClient } from "../supabase/server";
import type { Database } from "../supabase/database.types";
import {
  canTransitionDenunciaStatus,
  denunciaStatusColumns,
  denunciaStatusLabels,
  isDenunciaStatus,
  type DenunciaStatus,
} from "./denuncia-workflow";

type AuditAction = Database["public"]["Enums"]["audit_action"];
type DenunciaRow = Database["public"]["Tables"]["denuncias"]["Row"];

export type AdminDenuncia = DenunciaRow & {
  motivos_denuncia: {
    nome: string;
  } | null;
  profiles: {
    nome: string;
  } | null;
};

export type DenunciaFilters = {
  status?: DenunciaStatus;
  motivoId?: string;
  conselheiroId?: string;
  dataInicio?: string;
  dataFim?: string;
};

export {
  canTransitionDenunciaStatus,
  denunciaStatusColumns,
  denunciaStatusLabels,
  type DenunciaStatus,
};

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function getSearchValue(
  input: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = input[key];

  return Array.isArray(value) ? value[0] : value;
}

export function parseDenunciaFilters(
  input: Record<string, string | string[] | undefined>
): DenunciaFilters {
  const status = getSearchValue(input, "status");
  const motivoId = getSearchValue(input, "motivo_id");
  const conselheiroId = getSearchValue(input, "conselheiro_id");
  const dataInicio = getSearchValue(input, "data_inicio");
  const dataFim = getSearchValue(input, "data_fim");
  const filters: DenunciaFilters = {};

  if (status && isDenunciaStatus(status)) {
    filters.status = status;
  }

  if (motivoId && uuidPattern.test(motivoId)) {
    filters.motivoId = motivoId;
  }

  if (conselheiroId && uuidPattern.test(conselheiroId)) {
    filters.conselheiroId = conselheiroId;
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
    atribuida: [],
    em_analise: [],
    convertida_em_chamado: [],
    arquivada: [],
  };

  for (const row of rows) {
    groups[row.status].push(row);
  }

  return groups;
}

export function buildDenunciaAssignmentUpdate(conselheiroId: string) {
  if (!uuidPattern.test(conselheiroId)) {
    throw new Error("conselheiro invalido");
  }

  return {
    conselheiro_responsavel_id: conselheiroId,
    status: "atribuida" as const,
  };
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
      "id,motivo_id,status,relato,local_ocorrencia,vitima_nome_informado,vitima_idade_informada,vitima_endereco_informado,vitima_nome_pai_informado,vitima_nome_mae_informado,vitima_escola_informada,vitima_genero_informado,conselheiro_responsavel_id,observacoes_internas,created_at,updated_at,motivos_denuncia(nome),profiles!denuncias_conselheiro_responsavel_id_fkey(nome)"
    )
    .order("created_at", { ascending: false });

  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  if (filters.motivoId) {
    query = query.eq("motivo_id", filters.motivoId);
  }

  if (filters.conselheiroId) {
    query = query.eq("conselheiro_responsavel_id", filters.conselheiroId);
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
      "id,motivo_id,status,relato,local_ocorrencia,vitima_nome_informado,vitima_idade_informada,vitima_endereco_informado,vitima_nome_pai_informado,vitima_nome_mae_informado,vitima_escola_informada,vitima_genero_informado,conselheiro_responsavel_id,observacoes_internas,created_at,updated_at,motivos_denuncia(nome),profiles!denuncias_conselheiro_responsavel_id_fkey(nome)"
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error("Nao foi possivel carregar a denuncia.");
  }

  return data as AdminDenuncia | null;
}

export async function assignDenunciaAction(formData: FormData) {
  "use server";

  const profile = await requireAdminProfile();
  const denunciaId = String(formData.get("denuncia_id") ?? "");
  const conselheiroId = String(formData.get("conselheiro_id") ?? "");

  if (!uuidPattern.test(denunciaId)) {
    redirect("/admin/denuncias?error=denuncia_invalida");
  }

  let payload: ReturnType<typeof buildDenunciaAssignmentUpdate>;

  try {
    payload = buildDenunciaAssignmentUpdate(conselheiroId);
  } catch {
    redirect(`/admin/denuncias/${denunciaId}?error=conselheiro_invalido`);
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("denuncias")
    .update(payload)
    .eq("id", denunciaId);

  if (error) {
    redirect(`/admin/denuncias/${denunciaId}?error=atribuicao_falhou`);
  }

  await insertAuditLog({
    userId: profile.id,
    action: "update",
    entityId: denunciaId,
    metadata: {
      origem: "admin_denuncia_detail",
      conselheiro_responsavel_id: conselheiroId,
      status_novo: "atribuida",
    },
  });

  redirect(`/admin/denuncias/${denunciaId}?success=denuncia_atribuida`);
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

export async function moveDenunciaStatusAction(input: {
  denunciaId: string;
  fromStatus: DenunciaStatus;
  toStatus: DenunciaStatus;
}) {
  "use server";

  const profile = await requireAdminProfile();

  if (
    !uuidPattern.test(input.denunciaId) ||
    !isDenunciaStatus(input.fromStatus) ||
    !isDenunciaStatus(input.toStatus) ||
    !canTransitionDenunciaStatus(input.fromStatus, input.toStatus)
  ) {
    throw new Error("transicao invalida");
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("denuncias")
    .update({ status: input.toStatus })
    .eq("id", input.denunciaId)
    .eq("status", input.fromStatus);

  if (error) {
    throw new Error("nao foi possivel atualizar");
  }

  await insertAuditLog({
    userId: profile.id,
    action: "status_change",
    entityId: input.denunciaId,
    metadata: {
      origem: "admin_denuncias_kanban_dnd",
      status_anterior: input.fromStatus,
      status_novo: input.toStatus,
    },
  });

  revalidatePath("/admin/denuncias");
}
