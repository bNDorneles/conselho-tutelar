import { ArrowRight, Filter } from "lucide-react";
import Link from "next/link";

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
import { signOutAction } from "@/lib/auth/actions";
import {
  chamadoStatusColumns,
  chamadoStatusLabels,
  getAdminChamados,
  getConselheiroOptions,
  parseChamadoFilters,
} from "@/lib/admin/chamados";
import {
  formatDashboardDate,
  summarizeText,
} from "@/lib/admin/dashboard";

export const dynamic = "force-dynamic";

type AdminChamadosPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminChamadosPage({
  searchParams,
}: AdminChamadosPageProps) {
  const profile = await requireAdminProfile();
  const params = (await searchParams) ?? {};
  const filters = parseChamadoFilters(params);
  const [chamados, conselheiros] = await Promise.all([
    getAdminChamados(filters),
    getConselheiroOptions(),
  ]);

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/admin" className="text-sm font-semibold">
            Conselho Tutelar
          </Link>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="hidden rounded-lg sm:inline-flex">
              {profile.role}
            </Badge>
            <form action={signOutAction}>
              <Button type="submit" variant="outline" size="sm">
                Sair
              </Button>
            </form>
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-6xl px-5 py-8">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge className="mb-4 rounded-lg bg-primary text-primary-foreground">
              Atendimento
            </Badge>
            <h1 className="text-3xl font-semibold leading-tight">
              Chamados.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Acompanhe casos formalizados a partir das denuncias e filtre por
              responsavel, status ou periodo.
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
              <Filter className="size-4 text-primary" aria-hidden="true" />
              Filtros
            </CardTitle>
            <CardDescription>
              Refine a lista por situacao, conselheiro e data de abertura.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 md:grid-cols-5">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  defaultValue={filters.status ?? ""}
                  className="h-9 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">Todos</option>
                  {chamadoStatusColumns.map((status) => (
                    <option key={status} value={status}>
                      {chamadoStatusLabels[status]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="conselheiro_id">Conselheiro</Label>
                <select
                  id="conselheiro_id"
                  name="conselheiro_id"
                  defaultValue={filters.conselheiroId ?? ""}
                  className="h-9 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">Todos</option>
                  {conselheiros.map((conselheiro) => (
                    <option key={conselheiro.id} value={conselheiro.id}>
                      {conselheiro.nome}
                    </option>
                  ))}
                </select>
              </div>
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
              <div className="flex items-end gap-2">
                <Button type="submit" className="w-full">
                  Aplicar
                </Button>
                <Link
                  href="/admin/chamados"
                  className="inline-flex h-8 items-center justify-center rounded-lg border bg-card px-3 text-sm font-medium transition-colors hover:bg-muted"
                >
                  Limpar
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {chamados.length > 0 ? (
            chamados.map((chamado) => (
              <Card key={chamado.id} className="rounded-lg">
                <CardContent className="grid gap-4 p-4 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="rounded-lg">
                        {chamadoStatusLabels[chamado.status]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Aberto em {formatDashboardDate(chamado.data_abertura)}
                      </span>
                    </div>
                    <h2 className="text-base font-semibold">{chamado.titulo}</h2>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {summarizeText(chamado.descricao ?? "Sem descricao.", 140)}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Responsavel: {chamado.profiles?.nome ?? "Nao informado"} ·
                      Vitima: {chamado.vitimas?.nome ?? "Nao informada"}
                    </p>
                  </div>
                  <Link
                    href={`/admin/chamados/${chamado.id}`}
                    className="inline-flex h-8 items-center justify-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
                  >
                    Abrir detalhe
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
              Nenhum chamado encontrado para os filtros selecionados.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
