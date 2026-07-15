import type { DenunciaInput } from "./validation";

export function buildDenunciaInsertPayload(input: DenunciaInput) {
  return {
    motivo_id: input.motivo_id,
    relato: input.relato,
    local_ocorrencia: input.local_ocorrencia,
    vitima_nome_informado: input.vitima_nome_informado,
    vitima_idade_informada: input.vitima_idade_informada,
    vitima_endereco_informado: input.vitima_endereco_informado,
    vitima_nome_pai_informado: input.vitima_nome_pai_informado,
    vitima_nome_mae_informado: input.vitima_nome_mae_informado,
    vitima_escola_informada: input.vitima_escola_informada,
    vitima_genero_informado: input.vitima_genero_informado,
  };
}
