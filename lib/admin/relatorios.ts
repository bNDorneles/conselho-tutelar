import { createServerSupabaseClient } from "../supabase/server";

export type ReportFilters = {
  dataInicio?: string;
  dataFim?: string;
};

export type ReportCategory =
  | "denuncias_por_motivo"
  | "chamados_por_status"
  | "chamados_por_conselheiro"
  | "encaminhamentos_por_periodo"
  | "medidas_mais_aplicadas";

export type CountItem = {
  label: string;
  total: number;
};

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
export const reportCategories: ReportCategory[] = [
  "denuncias_por_motivo",
  "chamados_por_status",
  "chamados_por_conselheiro",
  "encaminhamentos_por_periodo",
  "medidas_mais_aplicadas",
];

export const reportCategoryLabels: Record<ReportCategory, string> = {
  denuncias_por_motivo: "Denuncias por motivo",
  chamados_por_status: "Chamados por status",
  chamados_por_conselheiro: "Chamados por conselheiro",
  encaminhamentos_por_periodo: "Encaminhamentos por periodo",
  medidas_mais_aplicadas: "Medidas protetivas",
};

export function parseReportFilters(
  input: Record<string, string | string[] | undefined>
): ReportFilters {
  const start = Array.isArray(input.data_inicio)
    ? input.data_inicio[0]
    : input.data_inicio;
  const end = Array.isArray(input.data_fim) ? input.data_fim[0] : input.data_fim;
  const filters: ReportFilters = {};

  if (start && datePattern.test(start)) {
    filters.dataInicio = start;
  }

  if (end && datePattern.test(end)) {
    filters.dataFim = end;
  }

  return filters;
}

export function parseReportCategories(
  input: Record<string, string | string[] | undefined>,
): ReportCategory[] {
  const raw = input.categorias;
  const values = Array.isArray(raw) ? raw : raw ? [raw] : [];
  const selected = values.filter((value): value is ReportCategory =>
    reportCategories.includes(value as ReportCategory),
  );

  return selected.length > 0 ? selected : reportCategories;
}

export function buildReportExportQuery({
  filters,
  categories,
}: {
  filters: ReportFilters;
  categories: ReportCategory[];
}) {
  const params = new URLSearchParams();

  if (filters.dataInicio) {
    params.set("data_inicio", filters.dataInicio);
  }

  if (filters.dataFim) {
    params.set("data_fim", filters.dataFim);
  }

  for (const category of categories) {
    params.append("categorias", category);
  }

  return params.toString();
}

export function countByLabel(rows: Array<{ label: string | null | undefined }>) {
  const counts = new Map<string, number>();

  for (const row of rows) {
    const label = row.label?.trim() || "Nao informado";
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([label, total]) => ({ label, total }))
    .sort((a, b) => b.total - a.total || a.label.localeCompare(b.label));
}

export function calculatePercent(value: number, max: number) {
  if (max <= 0) {
    return 0;
  }

  return Math.round((value / max) * 100);
}

function applyPeriod<T extends { gte: (column: string, value: string) => T; lte: (column: string, value: string) => T }>(
  query: T,
  column: string,
  filters: ReportFilters
) {
  let next = query;

  if (filters.dataInicio) {
    next = next.gte(column, `${filters.dataInicio}T00:00:00.000Z`);
  }

  if (filters.dataFim) {
    next = next.lte(column, `${filters.dataFim}T23:59:59.999Z`);
  }

  return next;
}

export async function getAdminReportsData(filters: ReportFilters) {
  const supabase = await createServerSupabaseClient();
  const denunciasQuery = applyPeriod(
    supabase
      .from("denuncias")
      .select("id,created_at,motivos_denuncia(nome)"),
    "created_at",
    filters
  );
  const chamadosQuery = applyPeriod(
    supabase
      .from("chamados")
      .select("id,status,data_abertura,profiles(nome)"),
    "data_abertura",
    filters
  );
  const encaminhamentosQuery = applyPeriod(
    supabase
      .from("encaminhamentos")
      .select("id,data_encaminhamento,medidas_protetivas(nome)"),
    "data_encaminhamento",
    filters
  );

  const [denuncias, chamados, encaminhamentos] = await Promise.all([
    denunciasQuery,
    chamadosQuery,
    encaminhamentosQuery,
  ]);

  if (denuncias.error || chamados.error || encaminhamentos.error) {
    throw new Error("Nao foi possivel carregar os relatorios.");
  }

  const denunciasRows = denuncias.data ?? [];
  const chamadosRows = chamados.data ?? [];
  const encaminhamentosRows = encaminhamentos.data ?? [];

  return {
    totals: {
      denuncias: denunciasRows.length,
      chamados: chamadosRows.length,
      encaminhamentos: encaminhamentosRows.length,
    },
    denunciasPorMotivo: countByLabel(
      denunciasRows.map((row) => ({
        label: row.motivos_denuncia?.nome,
      }))
    ),
    chamadosPorStatus: countByLabel(
      chamadosRows.map((row) => ({
        label: row.status,
      }))
    ),
    chamadosPorConselheiro: countByLabel(
      chamadosRows.map((row) => ({
        label: row.profiles?.nome,
      }))
    ),
    encaminhamentosPorPeriodo: countByLabel(
      encaminhamentosRows.map((row) => ({
        label: new Intl.DateTimeFormat("pt-BR", {
          dateStyle: "short",
          timeZone: "America/Sao_Paulo",
        }).format(new Date(row.data_encaminhamento)),
      }))
    ),
    medidasMaisAplicadas: countByLabel(
      encaminhamentosRows.map((row) => ({
        label: row.medidas_protetivas?.nome,
      }))
    ),
  };
}
