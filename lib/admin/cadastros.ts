import { redirect } from "next/navigation";

import { requireAdminProfile } from "../auth/admin";
import { createServerSupabaseClient } from "../supabase/server";
import type { Database } from "../supabase/database.types";

type ConselhoUpdate = Database["public"]["Tables"]["conselho_tutelar"]["Update"];
type ProfileUpsert = Database["public"]["Tables"]["profiles"]["Insert"];

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function optionalText(value: unknown) {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

export function parseRequiredName(value: unknown) {
  const name = optionalText(value);

  if (!name) {
    throw new Error("nome obrigatorio");
  }

  return name;
}

export function buildConselhoUpdate(
  input: Record<string, string | undefined>
): ConselhoUpdate {
  return {
    nome: parseRequiredName(input.nome),
    municipio: parseRequiredName(input.municipio),
    uf: parseRequiredName(input.uf),
    endereco: optionalText(input.endereco),
    telefone: optionalText(input.telefone),
    email: optionalText(input.email),
    horario_atendimento: optionalText(input.horario_atendimento),
    whatsapp: optionalText(input.whatsapp),
    facebook_url: optionalText(input.facebook_url),
    instagram_url: optionalText(input.instagram_url),
    mapa_url: optionalText(input.mapa_url),
  };
}

export function buildConselheiroProfileUpsert(
  input: Record<string, string | undefined>
): ProfileUpsert {
  const id = input.id ?? "";

  if (!uuidPattern.test(id)) {
    throw new Error("usuario invalido");
  }

  return {
    id,
    nome: parseRequiredName(input.nome),
    email: optionalText(input.email),
    telefone: optionalText(input.telefone),
    cargo: optionalText(input.cargo),
    foto_url: optionalText(input.foto_url),
    sobre: optionalText(input.sobre),
    mandato: optionalText(input.mandato),
    role: "conselheiro",
    ativo: true,
    exibir_publico: input.exibir_publico === "true",
  };
}

export async function requireActiveAdminProfile() {
  const profile = await requireAdminProfile();

  if (profile.role !== "admin") {
    redirect("/admin");
  }

  return profile;
}

async function insertAuditLog(args: {
  actorId: string;
  action: Database["public"]["Enums"]["audit_action"];
  entityTable: string;
  entityId: string;
}) {
  const supabase = await createServerSupabaseClient();
  await supabase.from("audit_logs").insert({
    actor_id: args.actorId,
    action: args.action,
    entity_table: args.entityTable,
    entity_id: args.entityId,
    metadata: {
      origem: "admin_cadastros",
    },
  });
}

export async function getAdminCadastrosData() {
  await requireActiveAdminProfile();
  const supabase = await createServerSupabaseClient();
  const [motivos, medidas, profiles, conselho] = await Promise.all([
    supabase.from("motivos_denuncia").select("*").order("nome"),
    supabase.from("medidas_protetivas").select("*").order("nome"),
    supabase.from("profiles").select("*").order("nome"),
    supabase.from("conselho_tutelar").select("*").limit(1).maybeSingle(),
  ]);

  if (motivos.error || medidas.error || profiles.error || conselho.error) {
    throw new Error("Nao foi possivel carregar os cadastros.");
  }

  return {
    motivos: motivos.data ?? [],
    medidas: medidas.data ?? [],
    profiles: profiles.data ?? [],
    conselho: conselho.data,
  };
}

export async function upsertConselheiroAction(formData: FormData) {
  "use server";

  const profile = await requireActiveAdminProfile();
  const supabase = await createServerSupabaseClient();
  let payload: ProfileUpsert;

  try {
    payload = buildConselheiroProfileUpsert({
      id: String(formData.get("id") ?? ""),
      nome: String(formData.get("nome") ?? ""),
      email: String(formData.get("email") ?? ""),
      telefone: String(formData.get("telefone") ?? ""),
      cargo: String(formData.get("cargo") ?? ""),
      foto_url: String(formData.get("foto_url") ?? ""),
      sobre: String(formData.get("sobre") ?? ""),
      mandato: String(formData.get("mandato") ?? ""),
      exibir_publico: String(formData.get("exibir_publico") ?? ""),
    });
  } catch {
    redirect("/admin/cadastros?error=conselheiro_invalido#conselheiros");
  }

  const { error } = await supabase.from("profiles").upsert(payload);

  if (!error) {
    await insertAuditLog({
      actorId: profile.id,
      action: "update",
      entityTable: "profiles",
      entityId: payload.id,
    });
  }

  redirect("/admin/cadastros#conselheiros");
}

export async function createMotivoAction(formData: FormData) {
  "use server";

  const profile = await requireActiveAdminProfile();
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("motivos_denuncia")
    .insert({
      nome: parseRequiredName(formData.get("nome")),
      descricao: optionalText(formData.get("descricao")),
      ativo: true,
    })
    .select("id")
    .single();

  if (!error) {
    await insertAuditLog({
      actorId: profile.id,
      action: "create",
      entityTable: "motivos_denuncia",
      entityId: data.id,
    });
  }

  redirect("/admin/cadastros");
}

export async function createMedidaAction(formData: FormData) {
  "use server";

  const profile = await requireActiveAdminProfile();
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("medidas_protetivas")
    .insert({
      nome: parseRequiredName(formData.get("nome")),
      descricao: optionalText(formData.get("descricao")),
      ativo: true,
    })
    .select("id")
    .single();

  if (!error) {
    await insertAuditLog({
      actorId: profile.id,
      action: "create",
      entityTable: "medidas_protetivas",
      entityId: data.id,
    });
  }

  redirect("/admin/cadastros");
}

export async function toggleCadastroAction(formData: FormData) {
  "use server";

  const profile = await requireActiveAdminProfile();
  const table = String(formData.get("table") ?? "");
  const id = String(formData.get("id") ?? "");
  const ativo = String(formData.get("ativo") ?? "") === "true";

  if (
    !["motivos_denuncia", "medidas_protetivas", "profiles"].includes(table) ||
    !uuidPattern.test(id)
  ) {
    redirect("/admin/cadastros");
  }

  const supabase = await createServerSupabaseClient();
  const query =
    table === "profiles"
      ? supabase.from("profiles").update({ ativo: !ativo }).eq("id", id)
      : table === "motivos_denuncia"
        ? supabase.from("motivos_denuncia").update({ ativo: !ativo }).eq("id", id)
        : supabase.from("medidas_protetivas").update({ ativo: !ativo }).eq("id", id);
  const { error } = await query;

  if (!error) {
    await insertAuditLog({
      actorId: profile.id,
      action: "update",
      entityTable: table,
      entityId: id,
    });
  }

  redirect("/admin/cadastros");
}

export async function updateConselhoAction(formData: FormData) {
  "use server";

  const profile = await requireActiveAdminProfile();
  const id = String(formData.get("id") ?? "");
  const supabase = await createServerSupabaseClient();
  const payload = buildConselhoUpdate({
    nome: String(formData.get("nome") ?? ""),
    municipio: String(formData.get("municipio") ?? ""),
    uf: String(formData.get("uf") ?? ""),
    endereco: String(formData.get("endereco") ?? ""),
    telefone: String(formData.get("telefone") ?? ""),
    email: String(formData.get("email") ?? ""),
    horario_atendimento: String(formData.get("horario_atendimento") ?? ""),
    whatsapp: String(formData.get("whatsapp") ?? ""),
    facebook_url: String(formData.get("facebook_url") ?? ""),
    instagram_url: String(formData.get("instagram_url") ?? ""),
    mapa_url: String(formData.get("mapa_url") ?? ""),
  });

  const { error } = await supabase
    .from("conselho_tutelar")
    .update(payload)
    .eq("id", id);

  if (!error && uuidPattern.test(id)) {
    await insertAuditLog({
      actorId: profile.id,
      action: "update",
      entityTable: "conselho_tutelar",
      entityId: id,
    });
  }

  redirect("/admin/cadastros");
}
