import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null))
  .optional();

const optionalAge = z
  .union([z.string(), z.number()])
  .optional()
  .transform((value) => {
    if (value === undefined || value === "") {
      return null;
    }

    return Number(value);
  })
  .pipe(z.number().int().min(0).max(17).nullable());

const optionalGender = z.preprocess(
  (value) => (value === "" || value === undefined ? null : value),
  z.enum(["feminino", "masculino", "outro", "nao_informado"]).nullable(),
);

export const denunciaSchema = z.object({
  motivo_id: z.string().uuid("Selecione um motivo valido."),
  relato: z
    .string()
    .trim()
    .min(20, "Descreva a situacao com pelo menos 20 caracteres.")
    .max(4000, "O relato deve ter no maximo 4000 caracteres."),
  local_ocorrencia: optionalText,
  vitima_nome_informado: optionalText,
  vitima_idade_informada: optionalAge,
  vitima_endereco_informado: optionalText,
  vitima_nome_pai_informado: optionalText,
  vitima_nome_mae_informado: optionalText,
  vitima_escola_informada: optionalText,
  vitima_genero_informado: optionalGender,
});

export type DenunciaInput = z.infer<typeof denunciaSchema>;

