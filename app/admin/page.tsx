import {
  ClipboardList,
  Clock3,
  FileWarning,
  ListChecks,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireAdminProfile } from "@/lib/auth/admin";
import {
  formatDashboardDate,
  getAdminDashboardData,
  summarizeText,
} from "@/lib/admin/dashboard";

export const dynamic = "force-dynamic";

const statusLabels = {
  recebida: "Recebida",
  atribuida: "Atribuida",
  em_analise: "Em analise",
  convertida_em_chamado: "Convertida em chamado",
  arquivada: "Arquivada",
  aberto: "Aberto",
  em_atendimento: "Em atendimento",
  finalizado: "Finalizado",
};

export default async function AdminPage() {
  const profile = await requireAdminProfile();
  const dashboard = await getAdminDashboardData();
  const metricCards = [
    {
      title: "Denuncias",
      value: dashboard.metrics.denunciasTotal,
      description: "Relatos recebidos no canal publico.",
      icon: FileWarning,
    },
    {
      title: "Chamados abertos",
      value: dashboard.metrics.chamadosAbertos,
      description: "Casos formalizados aguardando atendimento.",
      icon: ClipboardList,
    },
    {
      title: "Em atendimento",
      value: dashboard.metrics.chamadosEmAtendimento,
      description: "Chamados acompanhados por conselheiros.",
      icon: Clock3,
    },
    {
      title: "Finalizados",
      value: dashboard.metrics.chamadosFinalizados,
      description: "Chamados encerrados no sistema.",
      icon: ListChecks,
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto w-full max-w-6xl px-5 py-10">
        <div className="mb-8 max-w-3xl">
          <Badge className="mb-4 rounded-lg bg-primary text-primary-foreground">
            Painel privado
          </Badge>
          <h1 className="text-3xl font-semibold leading-tight">
            Painel administrativo.
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Ola, {profile.nome}. Esta area e restrita a conselheiros e
            administradores ativos.
          </p>
          {profile.role === "admin" ? (
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/admin/cadastros"
                className="inline-flex h-8 items-center justify-center rounded-lg border bg-card px-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                Cadastros auxiliares
              </Link>
              <Link
                href="/admin/relatorios"
                className="inline-flex h-8 items-center justify-center rounded-lg border bg-card px-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                Relatorios
              </Link>
            </div>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metricCards.map((card) => {
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
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Card className="rounded-lg">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>Denuncias recentes</CardTitle>
                <Link
                  href="/admin/denuncias"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Ver Kanban
                </Link>
              </div>
              <CardDescription>
                Ultimos relatos recebidos pelo formulario anonimo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {dashboard.recentDenuncias.length > 0 ? (
                dashboard.recentDenuncias.map((denuncia) => (
                  <div
                    key={denuncia.id}
                    className="rounded-lg border bg-background p-3"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <Badge variant="secondary" className="rounded-lg">
                        {statusLabels[denuncia.status]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDashboardDate(denuncia.created_at)}
                      </span>
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {summarizeText(denuncia.relato)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="rounded-lg border bg-background p-3 text-sm text-muted-foreground">
                  Nenhuma denuncia registrada ainda.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>Chamados recentes</CardTitle>
                <Link
                  href="/admin/chamados"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Ver chamados
                </Link>
              </div>
              <CardDescription>
                Casos formalizados mais recentes para acompanhamento interno.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {dashboard.recentChamados.length > 0 ? (
                dashboard.recentChamados.map((chamado) => (
                  <div
                    key={chamado.id}
                    className="rounded-lg border bg-background p-3"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <Badge variant="secondary" className="rounded-lg">
                        {statusLabels[chamado.status]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDashboardDate(chamado.data_abertura)}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{chamado.titulo}</p>
                  </div>
                ))
              ) : (
                <p className="rounded-lg border bg-background p-3 text-sm text-muted-foreground">
                  Nenhum chamado formalizado ainda.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
