"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminProfile } from "../auth/admin";
import { createServerSupabaseClient } from "../supabase/server";
import {
  buildDenunciaAssignmentUpdate,
  canTransitionDenunciaStatus,
  insertDenunciaAuditLog,
  isUuid,
} from "./denuncias";
import { isDenunciaStatus, type DenunciaStatus } from "./denuncia-workflow";

export async function assignDenunciaAction(formData: FormData) {
  const profile = await requireAdminProfile();
  const denunciaId = String(formData.get("denuncia_id") ?? "");
  const conselheiroId = String(formData.get("conselheiro_id") ?? "");

  if (!isUuid(denunciaId)) {
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

  await insertDenunciaAuditLog({
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

export async function updateDenunciaStatusAction(formData: FormData) {
  const profile = await requireAdminProfile();
  const denunciaId = String(formData.get("denuncia_id") ?? "");
  const fromStatus = String(formData.get("from_status") ?? "");
  const toStatus = String(formData.get("to_status") ?? "");

  if (
    !isUuid(denunciaId) ||
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

  await insertDenunciaAuditLog({
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
  const profile = await requireAdminProfile();

  if (
    !isUuid(input.denunciaId) ||
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

  await insertDenunciaAuditLog({
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
