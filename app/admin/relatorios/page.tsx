import Link from "next/link";
import { BarChart3, ClipboardList, FileWarning, Route } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requireAdminProfile } from "@/lib/auth/admin";
import {
  calculatePercent,
  getAdminReportsData,
  parseReportCategories,
  parseReportFilters,
  reportCategories,
  reportCategoryLabels,
  type CountItem,
  type ReportCategory,
} from "@/lib/admin/relatorios";
import { getAreaAccent } from "@/lib/admin/visual-status";

export const dynamic = "force-dynamic";

type RelatoriosPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function RankingCard({
  title,
  description,
  items,
  chart = "bar",
}: {
  title: string;
  description: string;
  items: CountItem[];
  chart?: "bar" | "donut";
}) {
  const max = Math.max(0, ...items.map((item) => item.total));
  const total = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length > 0 ? (
          chart === "donut" ? (
            <div className="grid gap-4 md:grid-cols-[140px_1fr] md:items-center">
              <div
                className="mx-auto flex size-32 items-center justify-center rounded-full border text-center text-sm font-semibold"
                style={{
                  background: `conic-gradient(var(--primary) ${calculatePercent(
                    items[0]?.total ?? 0,
                    total,
                  )}%, var(--secondary) 0)`,
                }}
              >
                <span className="rounded-lg bg-card px-2 py-1">{total}</span>
              </div>
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-3 rounded-lg border bg-background px-3 py-2 text-sm"
                  >
                    <span className="font-medium">{item.label}</span>
                    <span className="text-muted-foreground">{item.total}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
          items.map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium">{item.label}</span>
                <span className="text-muted-foreground">{item.total}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${calculatePercent(item.total, max)}%` }}
                />
              </div>
            </div>
          ))
          )
        ) : (
          <p className="rounded-lg border bg-background p-3 text-sm text-muted-foreground">
            Sem dados para o periodo selecionado.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

const reportBlocks: Record<
  ReportCategory,
  {
    description: string;
    chart: "bar" | "donut";
    getItems: (data: Awaited<ReturnType<typeof getAdminReportsData>>) => CountItem[];
  }
> = {
  denuncias_por_motivo: {
    description: "Categorias mais frequentes no periodo.",
    chart: "bar",
    getItems: (data) => data.denunciasPorMotivo,
  },
  chamados_por_status: {
    description: "Distribuicao dos atendimentos.",
    chart: "donut",
    getItems: (data) => data.chamadosPorStatus,
  },
  chamados_por_conselheiro: {
    description: "Responsaveis vinculados aos chamados.",
    chart: "bar",
    getItems: (data) => data.chamadosPorConselheiro,
  },
  encaminhamentos_por_periodo: {
    description: "Volume diario de encaminhamentos.",
    chart: "bar",
    getItems: (data) => data.encaminhamentosPorPeriodo,
  },
  medidas_mais_aplicadas: {
    description: "Medidas vinculadas aos encaminhamentos.",
    chart: "donut",
    getItems: (data) => data.medidasMaisAplicadas,
  },
};

export default async function RelatoriosPage({
  searchParams,
}: RelatoriosPageProps) {
  await requireAdminProfile();
  const params = (await searchParams) ?? {};
  const filters = parseReportFilters(params);
  const selectedCategories = parseReportCategories(params);
  const data = await getAdminReportsData(filters);
  const areaAccent = getAreaAccent("relatorios");
  const cards = [
    {
      title: "Denuncias",
      value: data.totals.denuncias,
      icon: FileWarning,
    },
    {
      title: "Chamados",
      value: data.totals.chamados,
      icon: ClipboardList,
    },
    {
      title: "Encaminhamentos",
      value: data.totals.encaminhamentos,
      icon: Route,
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto w-full max-w-6xl px-5 py-8">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge
              variant="outline"
              className={`mb-4 rounded-lg ${areaAccent.className}`}
            >
              {areaAccent.label}
            </Badge>
            <h1 className="text-3xl font-semibold leading-tight">
              Visao gerencial.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Acompanhe indicadores basicos do atendimento com dados reais do
              periodo selecionado.
            </p>
          </div>
          <Link
            href="/admin"
            className="inline-flex h-8 items-center justify-center rounded-lg border bg-card px-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            Voltar ao painel
          </Link>
        </div>

        <Card className="mb-5 rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="size-4 text-primary" aria-hidden="true" />
              Periodo
            </CardTitle>
            <CardDescription>
              Filtre os relatorios por data de criacao/abertura/encaminhamento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end">
              <div className="space-y-2">
                <Label htmlFor="data_inicio">De</Label>
                <Input
                  id="data_inicio"
                  name="data_inicio"
                  type="date"
                  defaultValue={filters.dataInicio ?? ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data_fim">Ate</Label>
                <Input
                  id="data_fim"
                  name="data_fim"
                  type="date"
                  defaultValue={filters.dataFim ?? ""}
                />
              </div>
              <Button type="submit">Aplicar</Button>
              <Link
                href="/admin/relatorios"
                className="inline-flex h-8 items-center justify-center rounded-lg border bg-card px-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                Limpar
              </Link>
              </div>
              <fieldset className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                <legend className="mb-2 text-sm font-medium">
                  Categorias para comparar
                </legend>
                {reportCategories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      name="categorias"
                      value={category}
                      defaultChecked={selectedCategories.includes(category)}
                      className="size-4"
                    />
                    {reportCategoryLabels[category]}
                  </label>
                ))}
              </fieldset>
            </form>
          </CardContent>
        </Card>

        <div className="mb-5 grid gap-4 md:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <Card key={card.title} className="rounded-lg">
                <CardHeader className="space-y-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <div>
                    <CardDescription>{card.title}</CardDescription>
                    <CardTitle className="mt-1 text-3xl">
                      {card.value}
                    </CardTitle>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {selectedCategories.map((category) => {
            const block = reportBlocks[category];

            return (
              <RankingCard
                key={category}
                title={reportCategoryLabels[category]}
                description={block.description}
                items={block.getItems(data)}
                chart={block.chart}
              />
            );
          })}
        </div>
      </section>
    </main>
  );
}
