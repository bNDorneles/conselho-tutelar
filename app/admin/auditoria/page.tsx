import { redirect } from "next/navigation";
import Link from "next/link";
import { History } from "lucide-react";

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
  formatAuditAction,
  formatAuditEntity,
  getAdminAuditLogs,
  getAuditActorOptions,
  parseAuditFilters,
  summarizeAuditMetadata,
  type AuditAction,
} from "@/lib/admin/auditoria";
import { formatDashboardDate } from "@/lib/admin/dashboard";
import { getAreaAccent } from "@/lib/admin/visual-status";

export const dynamic = "force-dynamic";

type AuditoriaPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const actionOptions: AuditAction[] = [
  "create",
  "read",
  "update",
  "status_change",
  "delete",
];

const entityOptions = [
  "denuncias",
  "chamados",
  "encaminhamentos",
  "chamado_medidas_protetivas",
  "motivos_denuncia",
  "medidas_protetivas",
  "profiles",
  "conselho_tutelar",
];

export default async function AuditoriaPage({
  searchParams,
}: AuditoriaPageProps) {
  const profile = await requireAdminProfile();

  if (profile.role !== "admin") {
    redirect("/admin");
  }

  const params = (await searchParams) ?? {};
  const filters = parseAuditFilters(params);
  const [logs, actors] = await Promise.all([
    getAdminAuditLogs(filters),
    getAuditActorOptions(),
  ]);
  const areaAccent = getAreaAccent("auditoria");

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
              Auditoria do sistema.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Consulte quem acessou, alterou ou movimentou registros sensiveis
              no painel interno.
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
              <History className="size-4 text-primary" aria-hidden="true" />
              Filtros
            </CardTitle>
            <CardDescription>
              Limite a consulta por acao, tipo de registro, responsavel ou
              periodo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 md:grid-cols-6">
              <div className="space-y-2">
                <Label htmlFor="action">Acao</Label>
                <select
                  id="action"
                  name="action"
                  defaultValue={filters.action ?? ""}
                  className="h-9 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">Todas</option>
                  {actionOptions.map((action) => (
                    <option key={action} value={action}>
                      {formatAuditAction(action)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="entity_table">Registro</Label>
                <select
                  id="entity_table"
                  name="entity_table"
                  defaultValue={filters.entityTable ?? ""}
                  className="h-9 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">Todos</option>
                  {entityOptions.map((entity) => (
                    <option key={entity} value={entity}>
                      {formatAuditEntity(entity)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="actor_id">Responsavel</Label>
                <select
                  id="actor_id"
                  name="actor_id"
                  defaultValue={filters.actorId ?? ""}
                  className="h-9 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">Todos</option>
                  {actors.map((actor) => (
                    <option key={actor.id} value={actor.id}>
                      {actor.nome}
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
                  href="/admin/auditoria"
                  className="inline-flex h-8 items-center justify-center rounded-lg border bg-card px-3 text-sm font-medium transition-colors hover:bg-muted"
                >
                  Limpar
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Registros encontrados</CardTitle>
            <CardDescription>
              Exibindo os 100 eventos mais recentes conforme os filtros.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {logs.length > 0 ? (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="grid gap-3 rounded-lg border bg-background p-3 md:grid-cols-[180px_1fr]"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {formatAuditAction(log.action)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDashboardDate(log.created_at)}
                    </p>
                  </div>
                  <div className="min-w-0 space-y-1">
                    <p className="break-words text-sm">
                      <span className="font-medium">
                        {log.profiles?.nome ?? "Sistema/usuario removido"}
                      </span>{" "}
                      em {formatAuditEntity(log.entity_table)}
                    </p>
                    <p className="break-words text-sm text-muted-foreground">
                      {summarizeAuditMetadata(log.metadata)}
                    </p>
                    {log.entity_id ? (
                      <p className="break-all text-xs text-muted-foreground">
                        Registro: {log.entity_id}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-lg border bg-background p-3 text-sm text-muted-foreground">
                Nenhum registro de auditoria encontrado para os filtros.
              </p>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
