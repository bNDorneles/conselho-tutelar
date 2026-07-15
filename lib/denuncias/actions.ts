"use server";

import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { buildDenunciaInsertPayload } from "./payload";
import { denunciaSchema } from "./validation";

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

export async function submitDenunciaAction(formData: FormData) {
  const parsed = denunciaSchema.safeParse({
    motivo_id: getFormValue(formData, "motivo_id"),
    relato: getFormValue(formData, "relato"),
    local_ocorrencia: getFormValue(formData, "local_ocorrencia"),
    vitima_nome_informado: getFormValue(formData, "vitima_nome_informado"),
    vitima_idade_informada: getFormValue(formData, "vitima_idade_informada"),
    vitima_endereco_informado: getFormValue(
      formData,
      "vitima_endereco_informado"
    ),
    vitima_nome_pai_informado: getFormValue(
      formData,
      "vitima_nome_pai_informado"
    ),
    vitima_nome_mae_informado: getFormValue(
      formData,
      "vitima_nome_mae_informado"
    ),
    vitima_escola_informada: getFormValue(formData, "vitima_escola_informada"),
    vitima_genero_informado: getFormValue(
      formData,
      "vitima_genero_informado"
    ),
  });

  if (!parsed.success) {
    const message = encodeURIComponent(
      parsed.error.issues[0]?.message ?? "Verifique os campos informados."
    );

    redirect(`/denuncia?error=${message}`);
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("denuncias")
    .insert(buildDenunciaInsertPayload(parsed.data));

  if (error) {
    redirect("/denuncia?error=nao_foi_possivel_enviar");
  }

  redirect("/denuncia/enviada");
}

