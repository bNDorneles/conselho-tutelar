import type { Database } from "../supabase/database.types";
import type { DenunciaStatus } from "./denuncia-workflow";

export type DenunciaRow = Database["public"]["Tables"]["denuncias"]["Row"];

export type AdminDenuncia = DenunciaRow & {
  motivos_denuncia: {
    nome: string;
  } | null;
  profiles: {
    nome: string;
  } | null;
};

export type DenunciaFilters = {
  status?: DenunciaStatus;
  motivoId?: string;
  conselheiroId?: string;
  dataInicio?: string;
  dataFim?: string;
};
