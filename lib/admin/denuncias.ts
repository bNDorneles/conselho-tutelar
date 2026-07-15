import { createServerSupabaseClient } from "../supabase/server";
import type { Database } from "../supabase/database.types";
import type { AdminDenuncia, DenunciaFilters } from "./denuncia-types";
import {
  canTransitionDenunciaStatus,
  denunciaStatusColumns,
  denunciaStatusLabels,
  isDenunciaStatus,
  type DenunciaStatus,
} from "./denuncia-workflow";

type AuditAction = Database["public"]["Enums"]["audit_action"];

export {
  canTransitionDenunciaStatus,
  denunciaStatusColumns,
  denunciaStatusLabels,
  type AdminDenuncia,
  type DenunciaFilters,
  type DenunciaStatus,
};

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export function isUuid(value: string) {
  return uuidPattern.test(value);
}

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

  if (motivoId && isUuid(motivoId)) {
    filters.motivoId = motivoId;
  }

  if (conselheiroId && isUuid(conselheiroId)) {
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
  if (!isUuid(conselheiroId)) {
    throw new Error("conselheiro invalido");
  }

  return {
    conselheiro_responsavel_id: conselheiroId,
    status: "atribuida" as const,
  };
}

export async function insertDenunciaAuditLog(args: {
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
    console.error("getAdminDenuncias failed", error);
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
    console.error("getAdminDenunciaDetail failed", error);
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
  await insertDenunciaAuditLog({
    userId: profileId,
    action: "read",
    entityId: denunciaId,
    metadata: {
      origem: "admin_denuncia_detail",
    },
  });
}
