import { redirect } from "next/navigation";

import { requireAdminProfile } from "../auth/admin";
import { createServerSupabaseClient } from "../supabase/server";
import type { Database } from "../supabase/database.types";
import { denunciaStatusLabels } from "./denuncia-workflow";
import { getAdminDenunciaDetail, type AdminDenuncia } from "./denuncias";

type VitimaInsert = Database["public"]["Tables"]["vitimas"]["Insert"];
type ChamadoInsert = Database["public"]["Tables"]["chamados"]["Insert"];
type ChamadoUpdate = Database["public"]["Tables"]["chamados"]["Update"];
export type ChamadoStatus = Database["public"]["Enums"]["chamado_status"];
type ChamadoRow = Database["public"]["Tables"]["chamados"]["Row"];

export type AdminChamado = ChamadoRow & {
  profiles: {
    nome: string;
    role: Database["public"]["Enums"]["profile_role"];
  } | null;
  vitimas: {
    nome: string | null;
    idade_estimada: number | null;
    endereco: string | null;
  } | null;
  denuncias: {
    id: string;
    relato: string;
    status: Database["public"]["Enums"]["denuncia_status"];
  } | null;
};

export type ChamadoFilters = {
  status?: ChamadoStatus;
  conselheiroId?: string;
  dataInicio?: string;
  dataFim?: string;
};

const createChamadoTitle = "Atendimento a partir de denuncia anonima";
const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export const chamadoStatusColumns: ChamadoStatus[] = [
  "aberto",
  "em_atendimento",
  "finalizado",
];

export const chamadoStatusLabels: Record<ChamadoStatus, string> = {
  aberto: "Aberto",
  em_atendimento: "Em atendimento",
  finalizado: "Finalizado",
};

const allowedChamadoTransitions = new Set([
  "aberto:em_atendimento",
  "em_atendimento:aberto",
  "em_atendimento:finalizado",
  "finalizado:em_atendimento",
]);

function isChamadoStatus(value: string): value is ChamadoStatus {
  return chamadoStatusColumns.includes(value as ChamadoStatus);
}

function getSearchValue(
  input: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = input[key];

  return Array.isArray(value) ? value[0] : value;
}

export function denunciaHasVictimaInfo(denuncia: AdminDenuncia) {
  return Boolean(
    denuncia.vitima_nome_informado?.trim() ||
      denuncia.vitima_idade_informada !== null ||
      denuncia.vitima_endereco_informado?.trim() ||
      denuncia.vitima_escola_informada?.trim() ||
      denuncia.vitima_nome_mae_informado?.trim() ||
      denuncia.vitima_nome_pai_informado?.trim()
  );
}

export function buildVitimaInsert(denuncia: AdminDenuncia): VitimaInsert {
  return {
    nome: denuncia.vitima_nome_informado,
    idade_estimada: denuncia.vitima_idade_informada,
    endereco: denuncia.vitima_endereco_informado,
    escola: denuncia.vitima_escola_informada,
    responsavel_nome:
      denuncia.vitima_nome_mae_informado ?? denuncia.vitima_nome_pai_informado,
    observacoes: `Criada a partir da denuncia ${denuncia.id}.`,
  };
}

export function buildChamadoInsert({
  denuncia,
  conselheiroId,
  vitimaId,
}: {
  denuncia: AdminDenuncia;
  conselheiroId: string;
  vitimaId: string | null;
}): ChamadoInsert {
  return {
    denuncia_id: denuncia.id,
    vitima_id: vitimaId,
    conselheiro_id: conselheiroId,
    status: "aberto",
    titulo: createChamadoTitle,
    descricao: denuncia.relato,
  };
}

export function canCreateChamadoFromDenuncia(denuncia: AdminDenuncia) {
  return denuncia.status === "em_analise";
}

export function canTransitionChamadoStatus(
  from: ChamadoStatus,
  to: ChamadoStatus
) {
  return allowedChamadoTransitions.has(`${from}:${to}`);
}

export function parseChamadoFilters(
  input: Record<string, string | string[] | undefined>
): ChamadoFilters {
  const status = getSearchValue(input, "status");
  const conselheiroId = getSearchValue(input, "conselheiro_id");
  const dataInicio = getSearchValue(input, "data_inicio");
  const dataFim = getSearchValue(input, "data_fim");
  const filters: ChamadoFilters = {};

  if (status && isChamadoStatus(status)) {
    filters.status = status;
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

export function buildChamadoStatusUpdate(status: ChamadoStatus): ChamadoUpdate {
  return {
    status,
    data_fechamento: status === "finalizado" ? new Date().toISOString() : null,
  };
}

export function getLinkedDenunciaStatusLabel({
  chamadoStatus,
  denunciaStatus,
}: {
  chamadoStatus: ChamadoStatus;
  denunciaStatus: Database["public"]["Enums"]["denuncia_status"];
}) {
  if (chamadoStatus === "finalizado") {
    return "Atendimento finalizado";
  }

  return denunciaStatusLabels[denunciaStatus];
}

async function insertAuditLog(args: {
  actorId: string;
  action: Database["public"]["Enums"]["audit_action"];
  entityTable: string;
  entityId: string;
  metadata: Record<string, string | null>;
}) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("audit_logs").insert({
    actor_id: args.actorId,
    action: args.action,
    entity_table: args.entityTable,
    entity_id: args.entityId,
    metadata: args.metadata,
  });

  if (error) {
    throw new Error("Nao foi possivel registrar auditoria.");
  }
}

export async function createChamadoFromDenunciaAction(formData: FormData) {
  "use server";

  const profile = await requireAdminProfile();
  const denunciaId = String(formData.get("denuncia_id") ?? "");

  if (!uuidPattern.test(denunciaId)) {
    redirect("/admin/denuncias?error=denuncia_invalida");
  }

  const denuncia = await getAdminDenunciaDetail(denunciaId);

  if (!denuncia || !canCreateChamadoFromDenuncia(denuncia)) {
    redirect(`/admin/denuncias/${denunciaId}?error=nao_pode_criar_chamado`);
  }

  const supabase = await createServerSupabaseClient();
  let vitimaId: string | null = null;

  if (denunciaHasVictimaInfo(denuncia)) {
    const { data: vitima, error: vitimaError } = await supabase
      .from("vitimas")
      .insert(buildVitimaInsert(denuncia))
      .select("id")
      .single();

    if (vitimaError) {
      redirect(`/admin/denuncias/${denuncia.id}?error=vitima_nao_criada`);
    }

    vitimaId = vitima.id;
  }

  const { data: chamado, error: chamadoError } = await supabase
    .from("chamados")
    .insert(
      buildChamadoInsert({
        denuncia,
    conselheiroId: denuncia.conselheiro_responsavel_id ?? profile.id,
        vitimaId,
      })
    )
    .select("id")
    .single();

  if (chamadoError) {
    redirect(`/admin/denuncias/${denuncia.id}?error=chamado_nao_criado`);
  }

  const { error: updateError } = await supabase
    .from("denuncias")
    .update({ status: "convertida_em_chamado" })
    .eq("id", denuncia.id);

  if (updateError) {
    redirect(`/admin/denuncias/${denuncia.id}?error=denuncia_nao_atualizada`);
  }

  await insertAuditLog({
    actorId: profile.id,
    action: "create",
    entityTable: "chamados",
    entityId: chamado.id,
    metadata: {
      origem: "admin_denuncia_detail",
      denuncia_id: denuncia.id,
    },
  });

  await insertAuditLog({
    actorId: profile.id,
    action: "status_change",
    entityTable: "denuncias",
    entityId: denuncia.id,
    metadata: {
      origem: "admin_create_chamado",
      status_anterior: denuncia.status,
      status_novo: "convertida_em_chamado",
      chamado_id: chamado.id,
    },
  });

  redirect(`/admin/denuncias/${denuncia.id}?success=chamado_criado`);
}

export async function getAdminChamados(filters: ChamadoFilters) {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("chamados")
    .select(
      "id,denuncia_id,vitima_id,conselheiro_id,status,titulo,descricao,data_abertura,data_fechamento,created_at,updated_at,profiles(nome,role),vitimas(nome,idade_estimada,endereco),denuncias(id,relato,status)"
    )
    .order("data_abertura", { ascending: false });

  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  if (filters.conselheiroId) {
    query = query.eq("conselheiro_id", filters.conselheiroId);
  }

  if (filters.dataInicio) {
    query = query.gte("data_abertura", `${filters.dataInicio}T00:00:00.000Z`);
  }

  if (filters.dataFim) {
    query = query.lte("data_abertura", `${filters.dataFim}T23:59:59.999Z`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error("Nao foi possivel carregar os chamados.");
  }

  return (data ?? []) as AdminChamado[];
}

export async function getAdminChamadoDetail(id: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("chamados")
    .select(
      "id,denuncia_id,vitima_id,conselheiro_id,status,titulo,descricao,data_abertura,data_fechamento,created_at,updated_at,profiles(nome,role),vitimas(nome,idade_estimada,endereco),denuncias(id,relato,status)"
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error("Nao foi possivel carregar o chamado.");
  }

  return data as AdminChamado | null;
}

export async function getConselheiroOptions() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id,nome,role")
    .eq("ativo", true)
    .order("nome");

  if (error) {
    throw new Error("Nao foi possivel carregar os conselheiros.");
  }

  return data ?? [];
}

export async function recordChamadoRead(profileId: string, chamadoId: string) {
  await insertAuditLog({
    actorId: profileId,
    action: "read",
    entityTable: "chamados",
    entityId: chamadoId,
    metadata: {
      origem: "admin_chamado_detail",
    },
  });
}

export async function updateChamadoStatusAction(formData: FormData) {
  "use server";

  const profile = await requireAdminProfile();
  const chamadoId = String(formData.get("chamado_id") ?? "");
  const fromStatus = String(formData.get("from_status") ?? "");
  const toStatus = String(formData.get("to_status") ?? "");

  if (
    !uuidPattern.test(chamadoId) ||
    !isChamadoStatus(fromStatus) ||
    !isChamadoStatus(toStatus) ||
    !canTransitionChamadoStatus(fromStatus, toStatus)
  ) {
    redirect(`/admin/chamados/${chamadoId}?error=transicao_invalida`);
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("chamados")
    .update(buildChamadoStatusUpdate(toStatus))
    .eq("id", chamadoId)
    .eq("status", fromStatus);

  if (error) {
    redirect(`/admin/chamados/${chamadoId}?error=nao_foi_possivel_atualizar`);
  }

  await insertAuditLog({
    actorId: profile.id,
    action: "status_change",
    entityTable: "chamados",
    entityId: chamadoId,
    metadata: {
      origem: "admin_chamado_detail",
      status_anterior: fromStatus,
      status_novo: toStatus,
    },
  });

  redirect(`/admin/chamados/${chamadoId}?success=status_atualizado`);
}
