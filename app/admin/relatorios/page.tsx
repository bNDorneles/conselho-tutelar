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
  parseReportFilters,
  type CountItem,
} from "@/lib/admin/relatorios";

export const dynamic = "force-dynamic";

type RelatoriosPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function RankingCard({
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
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length > 0 ? (
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
        ) : (
          <p className="rounded-lg border bg-background p-3 text-sm text-muted-foreground">
            Sem dados para o periodo selecionado.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default async function RelatoriosPage({
  searchParams,
}: RelatoriosPageProps) {
  await requireAdminProfile();
  const params = (await searchParams) ?? {};
  const filters = parseReportFilters(params);
  const data = await getAdminReportsData(filters);
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
            <Badge className="mb-4 rounded-lg bg-primary text-primary-foreground">
              Relatorios
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
            <form className="grid gap-4 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end">
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
          <RankingCard
            title="Denuncias por motivo"
            description="Categorias mais frequentes no periodo."
            items={data.denunciasPorMotivo}
          />
          <RankingCard
            title="Chamados por status"
            description="Distribuicao dos atendimentos."
            items={data.chamadosPorStatus}
          />
          <RankingCard
            title="Chamados por conselheiro"
            description="Responsaveis vinculados aos chamados."
            items={data.chamadosPorConselheiro}
          />
          <RankingCard
            title="Encaminhamentos por periodo"
            description="Volume diario de encaminhamentos."
            items={data.encaminhamentosPorPeriodo}
          />
          <RankingCard
            title="Medidas protetivas mais aplicadas"
            description="Medidas vinculadas aos encaminhamentos."
            items={data.medidasMaisAplicadas}
          />
        </div>
      </section>
    </main>
  );
}
