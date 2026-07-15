import { redirect } from "next/navigation";

import { requireAdminProfile } from "../auth/admin";
import { createServerSupabaseClient } from "../supabase/server";
import type { Database } from "../supabase/database.types";
import { getAdminDenunciaDetail, type AdminDenuncia } from "./denuncias";

type VitimaInsert = Database["public"]["Tables"]["vitimas"]["Insert"];
type ChamadoInsert = Database["public"]["Tables"]["chamados"]["Insert"];

const createChamadoTitle = "Atendimento a partir de denuncia anonima";
const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function denunciaHasVictimaInfo(denuncia: AdminDenuncia) {
  return Boolean(
    denuncia.vitima_nome_informado?.trim() ||
      denuncia.vitima_idade_informada !== null ||
      denuncia.vitima_endereco_informado?.trim()
  );
}

export function buildVitimaInsert(denuncia: AdminDenuncia): VitimaInsert {
  return {
    nome: denuncia.vitima_nome_informado,
    idade_estimada: denuncia.vitima_idade_informada,
    endereco: denuncia.vitima_endereco_informado,
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
  return denuncia.status !== "convertida_em_chamado";
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
        conselheiroId: profile.id,
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
