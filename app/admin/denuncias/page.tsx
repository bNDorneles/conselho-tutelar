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
import { getConselheiroOptions } from "@/lib/admin/chamados";
import {
  buildDenunciaStatusGroups,
  canTransitionDenunciaStatus,
  denunciaStatusColumns,
  denunciaStatusLabels,
  getAdminDenuncias,
  getMotivosDenunciaOptions,
  parseDenunciaFilters,
  updateDenunciaStatusAction,
  type DenunciaStatus,
} from "@/lib/admin/denuncias";
import {
  formatDashboardDate,
  summarizeText,
} from "@/lib/admin/dashboard";

export const dynamic = "force-dynamic";

type AdminDenunciasPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const statusActions: Record<DenunciaStatus, DenunciaStatus[]> = {
  recebida: ["atribuida"],
  atribuida: ["em_analise", "recebida"],
  em_analise: ["arquivada"],
  convertida_em_chamado: [],
  arquivada: ["em_analise"],
};

function getErrorMessage(error?: string | string[]) {
  const value = Array.isArray(error) ? error[0] : error;

  if (value === "transicao_invalida") {
    return "Essa mudanca de status nao esta disponivel nesta etapa.";
  }

  if (value === "nao_foi_possivel_atualizar") {
    return "Nao foi possivel atualizar a denuncia agora.";
  }

  return null;
}

export default async function AdminDenunciasPage({
  searchParams,
}: AdminDenunciasPageProps) {
  await requireAdminProfile();
  const params = (await searchParams) ?? {};
  const filters = parseDenunciaFilters(params);
  const [denuncias, motivos, conselheiros] = await Promise.all([
    getAdminDenuncias(filters),
    getMotivosDenunciaOptions(),
    getConselheiroOptions(),
  ]);
  const groups = buildDenunciaStatusGroups(denuncias);
  const errorMessage = getErrorMessage(params.error);

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto w-full max-w-7xl px-5 py-8">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge className="mb-4 rounded-lg bg-primary text-primary-foreground">
              Triagem
            </Badge>
            <h1 className="text-3xl font-semibold leading-tight">
              Denuncias recebidas.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Organize relatos anonimos por status e abra detalhes para
              analisar com auditoria de acesso.
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
              Refine a visao por status, motivo ou periodo de recebimento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 md:grid-cols-6">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  defaultValue={filters.status ?? ""}
                  className="h-9 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">Todos</option>
                  {denunciaStatusColumns.map((status) => (
                    <option key={status} value={status}>
                      {denunciaStatusLabels[status]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="motivo_id">Motivo</Label>
                <select
                  id="motivo_id"
                  name="motivo_id"
                  defaultValue={filters.motivoId ?? ""}
                  className="h-9 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">Todos</option>
                  {motivos.map((motivo) => (
                    <option key={motivo.id} value={motivo.id}>
                      {motivo.nome}
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
                  href="/admin/denuncias"
                  className="inline-flex h-8 items-center justify-center rounded-lg border bg-card px-3 text-sm font-medium transition-colors hover:bg-muted"
                >
                  Limpar
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {errorMessage ? (
          <p className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errorMessage}
          </p>
        ) : null}

        <div className="grid gap-4 xl:grid-cols-4">
          {denunciaStatusColumns.map((status) => (
            <section key={status} className="min-h-64 rounded-lg border bg-card">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <h2 className="text-sm font-semibold">
                  {denunciaStatusLabels[status]}
                </h2>
                <Badge variant="secondary" className="rounded-lg">
                  {groups[status].length}
                </Badge>
              </div>
              <div className="space-y-3 p-3">
                {groups[status].length > 0 ? (
                  groups[status].map((denuncia) => (
                    <Card key={denuncia.id} className="rounded-lg">
                      <CardHeader className="space-y-2 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <Badge variant="outline" className="rounded-lg">
                            {denuncia.motivos_denuncia?.nome ?? "Sem motivo"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDashboardDate(denuncia.created_at)}
                          </span>
                        </div>
                        <CardDescription className="leading-6">
                          {summarizeText(denuncia.relato, 120)}
                        </CardDescription>
                        <p className="text-xs text-muted-foreground">
                          Responsavel: {denuncia.profiles?.nome ?? "Nao atribuido"}
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-3 p-4 pt-0">
                        <Link
                          href={`/admin/denuncias/${denuncia.id}`}
                          className="inline-flex h-8 w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
                        >
                          Abrir detalhe
                          <ArrowRight className="size-4" aria-hidden="true" />
                        </Link>
                        {statusActions[status].length > 0 ? (
                          <div className="grid gap-2">
                            {statusActions[status].map((nextStatus) =>
                              canTransitionDenunciaStatus(status, nextStatus) ? (
                                <form
                                  key={nextStatus}
                                  action={updateDenunciaStatusAction}
                                >
                                  <input
                                    type="hidden"
                                    name="denuncia_id"
                                    value={denuncia.id}
                                  />
                                  <input
                                    type="hidden"
                                    name="from_status"
                                    value={status}
                                  />
                                  <input
                                    type="hidden"
                                    name="to_status"
                                    value={nextStatus}
                                  />
                                  <Button
                                    type="submit"
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                  >
                                    Mover para{" "}
                                    {denunciaStatusLabels[nextStatus]}
                                  </Button>
                                </form>
                              ) : null
                            )}
                          </div>
                        ) : null}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="rounded-lg border bg-background p-3 text-sm text-muted-foreground">
                    Nenhuma denuncia nesta coluna.
                  </p>
                )}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
