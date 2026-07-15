"use server";

import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";
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
  });

  if (!parsed.success) {
    const message = encodeURIComponent(
      parsed.error.issues[0]?.message ?? "Verifique os campos informados."
    );

    redirect(`/denuncia?error=${message}`);
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("denuncias").insert({
    motivo_id: parsed.data.motivo_id,
    relato: parsed.data.relato,
    local_ocorrencia: parsed.data.local_ocorrencia,
    vitima_nome_informado: parsed.data.vitima_nome_informado,
    vitima_idade_informada: parsed.data.vitima_idade_informada,
    vitima_endereco_informado: parsed.data.vitima_endereco_informado,
  });

  if (error) {
    redirect("/denuncia?error=nao_foi_possivel_enviar");
  }

  redirect("/denuncia/enviada");
}

