import { redirect } from "next/navigation";

import { requireAdminProfile } from "../auth/admin";
import { createServerSupabaseClient } from "../supabase/server";
import type { Database } from "../supabase/database.types";

type EncaminhamentoInsert =
  Database["public"]["Tables"]["encaminhamentos"]["Insert"];
type EncaminhamentoRow = Database["public"]["Tables"]["encaminhamentos"]["Row"];

export type AdminEncaminhamento = EncaminhamentoRow & {
  medidas_protetivas: {
    nome: string;
  } | null;
  profiles: {
    nome: string;
  } | null;
};

type EncaminhamentoInput = {
  chamadoId: string;
  medidaProtetivaId: string | null;
  descricao: string;
  orgaoDestino: string | null;
  dataEncaminhamento: string | null;
};

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function optionalText(value: unknown) {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

export function parseEncaminhamentoInput(
  input: Record<string, string | undefined>
): EncaminhamentoInput {
  const chamadoId = input.chamado_id ?? "";
  const medidaProtetivaId = optionalText(input.medida_protetiva_id);
  const descricao = optionalText(input.descricao);
  const orgaoDestino = optionalText(input.orgao_destino);
  const dataEncaminhamento = optionalText(input.data_encaminhamento);

  if (!uuidPattern.test(chamadoId)) {
    throw new Error("chamado invalido");
  }

  if (medidaProtetivaId && !uuidPattern.test(medidaProtetivaId)) {
    throw new Error("medida invalida");
  }

  if (!descricao) {
    throw new Error("descricao obrigatoria");
  }

  return {
    chamadoId,
    medidaProtetivaId,
    descricao,
    orgaoDestino,
    dataEncaminhamento,
  };
}

export function buildEncaminhamentoInsert({
  input,
  responsavelId,
}: {
  input: EncaminhamentoInput;
  responsavelId: string;
}): EncaminhamentoInsert {
  const payload: EncaminhamentoInsert = {
    chamado_id: input.chamadoId,
    medida_protetiva_id: input.medidaProtetivaId,
    responsavel_id: responsavelId,
    descricao: input.descricao,
    orgao_destino: input.orgaoDestino,
  };

  if (input.dataEncaminhamento) {
    payload.data_encaminhamento = new Date(input.dataEncaminhamento).toISOString();
  }

  return payload;
}

async function insertAuditLog(args: {
  actorId: string;
  entityId: string;
  chamadoId: string;
}) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("audit_logs").insert({
    actor_id: args.actorId,
    action: "create",
    entity_table: "encaminhamentos",
    entity_id: args.entityId,
    metadata: {
      origem: "admin_chamado_detail",
      chamado_id: args.chamadoId,
    },
  });

  if (error) {
    throw new Error("Nao foi possivel registrar auditoria do encaminhamento.");
  }
}

export async function getMedidasProtetivasOptions() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("medidas_protetivas")
    .select("id,nome")
    .eq("ativo", true)
    .order("nome");

  if (error) {
    throw new Error("Nao foi possivel carregar as medidas protetivas.");
  }

  return data ?? [];
}

export async function getChamadoEncaminhamentos(chamadoId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("encaminhamentos")
    .select(
      "id,chamado_id,medida_protetiva_id,responsavel_id,descricao,orgao_destino,data_encaminhamento,created_at,updated_at,medidas_protetivas(nome),profiles(nome)"
    )
    .eq("chamado_id", chamadoId)
    .order("data_encaminhamento", { ascending: false });

  if (error) {
    throw new Error("Nao foi possivel carregar os encaminhamentos.");
  }

  return (data ?? []) as AdminEncaminhamento[];
}

export async function createEncaminhamentoAction(formData: FormData) {
  "use server";

  const profile = await requireAdminProfile();
  const input = parseEncaminhamentoInput({
    chamado_id: String(formData.get("chamado_id") ?? ""),
    medida_protetiva_id: String(formData.get("medida_protetiva_id") ?? ""),
    descricao: String(formData.get("descricao") ?? ""),
    orgao_destino: String(formData.get("orgao_destino") ?? ""),
    data_encaminhamento: String(formData.get("data_encaminhamento") ?? ""),
  });

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("encaminhamentos")
    .insert(
      buildEncaminhamentoInsert({
        input,
        responsavelId: profile.id,
      })
    )
    .select("id")
    .single();

  if (error) {
    redirect(`/admin/chamados/${input.chamadoId}?error=encaminhamento_nao_criado`);
  }

  await insertAuditLog({
    actorId: profile.id,
    entityId: data.id,
    chamadoId: input.chamadoId,
  });

  redirect(`/admin/chamados/${input.chamadoId}?success=encaminhamento_criado`);
}
