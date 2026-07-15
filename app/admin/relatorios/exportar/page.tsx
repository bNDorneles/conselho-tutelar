import Link from "next/link";

import { PrintReportButton } from "@/components/admin/print-report-button";
import { requireAdminProfile } from "@/lib/auth/admin";
import {
  calculatePercent,
  getAdminReportsData,
  parseReportCategories,
  parseReportFilters,
  reportCategoryLabels,
  type CountItem,
  type ReportCategory,
} from "@/lib/admin/relatorios";

export const dynamic = "force-dynamic";

type ExportarRelatoriosPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

type ReportsData = Awaited<ReturnType<typeof getAdminReportsData>>;

const reportBlocks: Record<
  ReportCategory,
  {
    description: string;
    getItems: (data: ReportsData) => CountItem[];
  }
> = {
  denuncias_por_motivo: {
    description: "Categorias mais frequentes no periodo.",
    getItems: (data) => data.denunciasPorMotivo,
  },
  chamados_por_status: {
    description: "Distribuicao dos atendimentos.",
    getItems: (data) => data.chamadosPorStatus,
  },
  chamados_por_conselheiro: {
    description: "Responsaveis vinculados aos chamados.",
    getItems: (data) => data.chamadosPorConselheiro,
  },
  encaminhamentos_por_periodo: {
    description: "Volume diario de encaminhamentos.",
    getItems: (data) => data.encaminhamentosPorPeriodo,
  },
  medidas_mais_aplicadas: {
    description: "Medidas vinculadas aos encaminhamentos.",
    getItems: (data) => data.medidasMaisAplicadas,
  },
};

function formatPeriod(filters: ReturnType<typeof parseReportFilters>) {
  if (filters.dataInicio && filters.dataFim) {
    return `${filters.dataInicio} ate ${filters.dataFim}`;
  }

  if (filters.dataInicio) {
    return `A partir de ${filters.dataInicio}`;
  }

  if (filters.dataFim) {
    return `Ate ${filters.dataFim}`;
  }

  return "Todo o periodo";
}

function ExportBlock({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: CountItem[];
}) {
  const max = Math.max(0, ...items.map((item) => item.total));
  const total = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <section className="break-inside-avoid border-t border-border py-5 print:border-slate-300">
      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold print:text-base">{title}</h2>
          <p className="text-sm text-muted-foreground print:text-slate-600">
            {description}
          </p>
        </div>
        <p className="text-sm font-medium text-muted-foreground print:text-slate-600">
          Total: {total}
        </p>
      </div>
      {items.length > 0 ? (
        <div className="overflow-hidden rounded-lg border print:rounded-none print:border-slate-300">
          <div className="grid grid-cols-[minmax(0,1fr)_80px_110px] bg-secondary/55 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground print:bg-slate-100 print:text-slate-700">
            <span>Categoria</span>
            <span className="text-right">Total</span>
            <span className="text-right">Percentual</span>
          </div>
          {items.map((item) => (
            <div
              key={item.label}
              className="grid grid-cols-[minmax(0,1fr)_80px_110px] items-center gap-3 border-t px-3 py-2 text-sm print:border-slate-200"
            >
              <span className="break-words font-medium">{item.label}</span>
              <span className="text-right tabular-nums">{item.total}</span>
              <div className="flex items-center justify-end gap-2">
                <div className="h-2 w-16 overflow-hidden rounded-full bg-secondary print:bg-slate-100">
                  <div
                    className="h-full rounded-full bg-primary print:bg-slate-700"
                    style={{ width: `${calculatePercent(item.total, max)}%` }}
                  />
                </div>
                <span className="w-8 text-right text-xs text-muted-foreground print:text-slate-600">
                  {calculatePercent(item.total, total)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-lg border bg-background p-3 text-sm text-muted-foreground print:border-slate-300 print:bg-white print:text-slate-600">
          Sem dados para o periodo selecionado.
        </p>
      )}
    </section>
  );
}

function ExecutiveBar({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span>{label}</span>
        <span className="font-semibold tabular-nums">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-secondary print:bg-slate-100">
        <div
          className="h-full rounded-full bg-primary print:bg-slate-700"
          style={{ width: `${calculatePercent(value, max)}%` }}
        />
      </div>
    </div>
  );
}

function ExecutiveSummary({
  denuncias,
  chamados,
  encaminhamentos,
}: {
  denuncias: number;
  chamados: number;
  encaminhamentos: number;
}) {
  const max = Math.max(denuncias, chamados, encaminhamentos, 1);

  return (
    <section className="mb-6 break-inside-avoid rounded-lg border bg-card p-5 print:rounded-none print:border-slate-300 print:bg-white">
      <div className="mb-4">
        <h2 className="text-lg font-semibold print:text-base">
          Resumo executivo
        </h2>
        <p className="text-sm text-muted-foreground print:text-slate-600">
          Visao consolidada dos registros no periodo selecionado.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <ExecutiveBar label="Denuncias recebidas" value={denuncias} max={max} />
        <ExecutiveBar label="Chamados formalizados" value={chamados} max={max} />
        <ExecutiveBar
          label="Encaminhamentos"
          value={encaminhamentos}
          max={max}
        />
      </div>
    </section>
  );
}

export default async function ExportarRelatoriosPage({
  searchParams,
}: ExportarRelatoriosPageProps) {
  const profile = await requireAdminProfile();
  const params = (await searchParams) ?? {};
  const filters = parseReportFilters(params);
  const selectedCategories = parseReportCategories(params);
  const data = await getAdminReportsData(filters);
  const generatedAt = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(new Date());

  return (
    <main className="min-h-screen bg-background print:min-h-0 print:bg-white">
      <section className="mx-auto w-full max-w-5xl px-5 py-8 print:max-w-none print:px-0 print:py-0 print:text-[12px]">
        <div className="mb-6 flex flex-col gap-3 border-b pb-5 md:flex-row md:items-start md:justify-between print:border-slate-300">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary print:text-slate-600">
              Conselho Tutelar de Sao Borja
            </p>
            <h1 className="text-3xl font-semibold leading-tight print:text-2xl">
              Relatorio do Conselho Tutelar
            </h1>
            <p className="mt-2 text-sm text-muted-foreground print:text-slate-600">
              Periodo: {formatPeriod(filters)}
            </p>
            <p className="text-sm text-muted-foreground print:text-slate-600">
              Gerado em {generatedAt} por {profile.nome}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 print:hidden">
            <Link
              href="/admin/relatorios"
              className="inline-flex h-8 items-center justify-center rounded-lg border bg-card px-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              Voltar aos relatorios
            </Link>
            <PrintReportButton />
          </div>
        </div>

        <ExecutiveSummary
          denuncias={data.totals.denuncias}
          chamados={data.totals.chamados}
          encaminhamentos={data.totals.encaminhamentos}
        />

        <div className="print:block">
          {selectedCategories.map((category) => {
            const block = reportBlocks[category];

            return (
              <ExportBlock
                key={category}
                title={reportCategoryLabels[category]}
                description={block.description}
                items={block.getItems(data)}
              />
            );
          })}
        </div>
      </section>
    </main>
  );
}
