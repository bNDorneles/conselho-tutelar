import { createServerSupabaseClient } from "../supabase/server";
import type { Database } from "../supabase/database.types";

type DenunciaStatus = Database["public"]["Enums"]["denuncia_status"];
type ChamadoStatus = Database["public"]["Enums"]["chamado_status"];

type DenunciaRow = Pick<
  Database["public"]["Tables"]["denuncias"]["Row"],
  "id" | "created_at" | "relato" | "status"
>;

type ChamadoRow = Pick<
  Database["public"]["Tables"]["chamados"]["Row"],
  "id" | "created_at" | "data_abertura" | "status" | "titulo"
>;

export type AdminDashboardData = {
  metrics: {
    denunciasTotal: number;
    chamadosAbertos: number;
    chamadosEmAtendimento: number;
    chamadosFinalizados: number;
  };
  recentDenuncias: DenunciaRow[];
  recentChamados: ChamadoRow[];
};

export function getCountValue(count: number | null) {
  return count ?? 0;
}

export function summarizeText(text: string, maxLength = 80) {
  const normalized = text.trim().replace(/\s+/g, " ");

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength)}...`;
}

export function formatDashboardDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(value));
}

async function countRows(
  table: "denuncias" | "chamados",
  status?: DenunciaStatus | ChamadoStatus
) {
  const supabase = await createServerSupabaseClient();
  let query = supabase.from(table).select("id", {
    count: "exact",
    head: true,
  });

  if (status) {
    query = query.eq("status", status);
  }

  const { count, error } = await query;

  if (error) {
    throw new Error("Nao foi possivel carregar os indicadores do dashboard.");
  }

  return getCountValue(count);
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const supabase = await createServerSupabaseClient();

  const [
    denunciasTotal,
    chamadosAbertos,
    chamadosEmAtendimento,
    chamadosFinalizados,
    recentDenunciasResult,
    recentChamadosResult,
  ] = await Promise.all([
    countRows("denuncias"),
    countRows("chamados", "aberto"),
    countRows("chamados", "em_atendimento"),
    countRows("chamados", "finalizado"),
    supabase
      .from("denuncias")
      .select("id,created_at,relato,status")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("chamados")
      .select("id,created_at,data_abertura,status,titulo")
      .order("data_abertura", { ascending: false })
      .limit(5),
  ]);

  if (recentDenunciasResult.error || recentChamadosResult.error) {
    throw new Error("Nao foi possivel carregar as listas recentes.");
  }

  return {
    metrics: {
      denunciasTotal,
      chamadosAbertos,
      chamadosEmAtendimento,
      chamadosFinalizados,
    },
    recentDenuncias: recentDenunciasResult.data ?? [],
    recentChamados: recentChamadosResult.data ?? [],
  };
}
