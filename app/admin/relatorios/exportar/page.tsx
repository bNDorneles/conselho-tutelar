import Link from "next/link";

import { PrintReportButton } from "@/components/admin/print-report-button";
import { Badge } from "@/components/ui/badge";
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

  return (
    <section className="break-inside-avoid rounded-lg border bg-card p-5">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {items.length > 0 ? (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium">{item.label}</span>
                <span>{item.total}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${calculatePercent(item.total, max)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-lg border bg-background p-3 text-sm text-muted-foreground">
          Sem dados para o periodo selecionado.
        </p>
      )}
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
    <main className="min-h-screen bg-background print:bg-white">
      <section className="mx-auto w-full max-w-5xl px-5 py-8 print:max-w-none print:px-0 print:py-0">
        <div className="mb-6 flex flex-col gap-3 border-b pb-5 md:flex-row md:items-start md:justify-between">
          <div>
            <Badge variant="outline" className="mb-3 rounded-lg print:hidden">
              Relatorio gerencial
            </Badge>
            <h1 className="text-3xl font-semibold leading-tight">
              Relatorio do Conselho Tutelar
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Periodo: {formatPeriod(filters)}
            </p>
            <p className="text-sm text-muted-foreground">
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

        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Denuncias</p>
            <strong className="text-3xl">{data.totals.denuncias}</strong>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Chamados</p>
            <strong className="text-3xl">{data.totals.chamados}</strong>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Encaminhamentos</p>
            <strong className="text-3xl">{data.totals.encaminhamentos}</strong>
          </div>
        </div>

        <div className="grid gap-5 print:block print:space-y-5">
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
