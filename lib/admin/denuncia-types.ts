import type { Database } from "../supabase/database.types";
import type { DenunciaStatus } from "./denuncia-workflow";

export type DenunciaRow = Database["public"]["Tables"]["denuncias"]["Row"];
export type ChamadoStatus = Database["public"]["Enums"]["chamado_status"];

export type AdminDenunciaChamado = {
  id: string;
  status: ChamadoStatus;
  data_fechamento: string | null;
  chamado_medidas_protetivas: Array<{ id: string }>;
  encaminhamentos: Array<{ id: string }>;
};

export type AdminDenuncia = DenunciaRow & {
  motivos_denuncia: {
    nome: string;
  } | null;
  profiles: {
    nome: string;
  } | null;
  chamados?: AdminDenunciaChamado[];
};

export type DenunciaFilters = {
  status?: DenunciaStatus;
  motivoId?: string;
  conselheiroId?: string;
  dataInicio?: string;
  dataFim?: string;
};
