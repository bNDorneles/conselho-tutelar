import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ClipboardList } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireAdminProfile } from "@/lib/auth/admin";
import {
  chamadoStatusLabels,
  canTransitionChamadoStatus,
  getAdminChamadoDetail,
  recordChamadoRead,
  updateChamadoStatusAction,
  type ChamadoStatus,
} from "@/lib/admin/chamados";
import { formatDashboardDate } from "@/lib/admin/dashboard";
import {
  applyMedidaProtetivaAction,
  createEncaminhamentoAction,
  getChamadoEncaminhamentos,
  getChamadoMedidas,
  getMedidasProtetivasOptions,
} from "@/lib/admin/encaminhamentos";

export const dynamic = "force-dynamic";

type ChamadoDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    error?: string;
    success?: string;
  }>;
};

const statusActions: Record<ChamadoStatus, ChamadoStatus[]> = {
  aberto: ["em_atendimento"],
  em_atendimento: ["aberto", "finalizado"],
  finalizado: ["em_atendimento"],
};

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | number | null;
}) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <p className="text-xs font-medium uppercase text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm">{value ?? "Nao informado"}</p>
    </div>
  );
}

export default async function ChamadoDetailPage({
  params,
  searchParams,
}: ChamadoDetailPageProps) {
  const profile = await requireAdminProfile();
  const { id } = await params;
  const query = await searchParams;
  const [chamado, medidas, encaminhamentos, medidasAplicadas] = await Promise.all([
    getAdminChamadoDetail(id),
    getMedidasProtetivasOptions(),
    getChamadoEncaminhamentos(id),
    getChamadoMedidas(id),
  ]);

  if (!chamado) {
    notFound();
  }

  await recordChamadoRead(profile.id, chamado.id);

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto w-full max-w-5xl px-5 py-8">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge className="mb-4 rounded-lg bg-primary text-primary-foreground">
              Detalhe do chamado
            </Badge>
            <h1 className="text-3xl font-semibold leading-tight">
              {chamado.titulo}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Acompanhe status, responsavel, vitima e origem do atendimento.
            </p>
          </div>
          <Link
            href="/admin/chamados"
            className="inline-flex h-8 items-center justify-center gap-2 rounded-lg border bg-card px-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Voltar aos chamados
          </Link>
        </div>

        {query?.success === "status_atualizado" ? (
          <p className="mb-5 rounded-lg border border-primary/20 bg-primary/8 px-3 py-2 text-sm text-primary">
            Status do chamado atualizado.
          </p>
        ) : null}
        {query?.success === "encaminhamento_criado" ? (
          <p className="mb-5 rounded-lg border border-primary/20 bg-primary/8 px-3 py-2 text-sm text-primary">
            Encaminhamento registrado no historico do chamado.
          </p>
        ) : null}
        {query?.success === "medida_aplicada" ? (
          <p className="mb-5 rounded-lg border border-primary/20 bg-primary/8 px-3 py-2 text-sm text-primary">
            Medida protetiva aplicada ao chamado.
          </p>
        ) : null}
        {query?.error ? (
          <p className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Nao foi possivel atualizar o chamado.
          </p>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="size-4 text-primary" aria-hidden="true" />
                Descricao
              </CardTitle>
              <CardDescription>
                Aberto em {formatDashboardDate(chamado.data_abertura)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                {chamado.descricao ?? "Sem descricao informada."}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Status</CardTitle>
              <CardDescription>Controle do acompanhamento.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <DetailItem
                label="Situacao atual"
                value={chamadoStatusLabels[chamado.status]}
              />
              <DetailItem
                label="Fechado em"
                value={
                  chamado.data_fechamento
                    ? formatDashboardDate(chamado.data_fechamento)
                    : null
                }
              />
              <div className="grid gap-2">
                {statusActions[chamado.status].map((nextStatus) =>
                  canTransitionChamadoStatus(chamado.status, nextStatus) ? (
                    <form key={nextStatus} action={updateChamadoStatusAction}>
                      <input type="hidden" name="chamado_id" value={chamado.id} />
                      <input
                        type="hidden"
                        name="from_status"
                        value={chamado.status}
                      />
                      <input
                        type="hidden"
                        name="to_status"
                        value={nextStatus}
                      />
                      <Button type="submit" variant="outline" className="w-full">
                        Mudar para {chamadoStatusLabels[nextStatus]}
                      </Button>
                    </form>
                  ) : null
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Responsaveis e vitima</CardTitle>
              <CardDescription>Dados vinculados ao atendimento.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <DetailItem
                label="Conselheiro"
                value={chamado.profiles?.nome ?? null}
              />
              <DetailItem label="Vitima" value={chamado.vitimas?.nome ?? null} />
              <DetailItem
                label="Idade estimada"
                value={chamado.vitimas?.idade_estimada ?? null}
              />
              <DetailItem
                label="Endereco"
                value={chamado.vitimas?.endereco ?? null}
              />
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Denuncia vinculada</CardTitle>
              <CardDescription>Origem do chamado formalizado.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {chamado.denuncias ? (
                <>
                  <DetailItem label="Status da denuncia" value={chamado.denuncias.status} />
                  <p className="rounded-lg border bg-background p-3 text-sm leading-6 text-muted-foreground">
                    {chamado.denuncias.relato}
                  </p>
                  <Link
                    href={`/admin/denuncias/${chamado.denuncias.id}`}
                    className="inline-flex h-8 items-center justify-center rounded-lg border bg-card px-3 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    Abrir denuncia
                  </Link>
                </>
              ) : (
                <p className="rounded-lg border bg-background p-3 text-sm text-muted-foreground">
                  Chamado sem denuncia vinculada.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Aplicar medida protetiva</CardTitle>
              <CardDescription>
                Vincule uma medida ao chamado antes ou junto do encaminhamento.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={applyMedidaProtetivaAction} className="space-y-4">
                <input type="hidden" name="chamado_id" value={chamado.id} />
                <div className="space-y-2">
                  <label
                    htmlFor="aplicar_medida_protetiva_id"
                    className="text-sm font-medium"
                  >
                    Medida protetiva
                  </label>
                  <select
                    id="aplicar_medida_protetiva_id"
                    name="medida_protetiva_id"
                    required
                    className="h-9 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <option value="">Selecione</option>
                    {medidas.map((medida) => (
                      <option key={medida.id} value={medida.id}>
                        {medida.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="observacoes" className="text-sm font-medium">
                    Observacoes
                  </label>
                  <textarea
                    id="observacoes"
                    name="observacoes"
                    rows={4}
                    className="min-h-20 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Aplicar medida
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Medidas aplicadas</CardTitle>
              <CardDescription>
                Medidas protetivas vinculadas a este chamado.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {medidasAplicadas.length > 0 ? (
                medidasAplicadas.map((medida) => (
                  <div
                    key={medida.id}
                    className="rounded-lg border bg-background p-3"
                  >
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <Badge variant="secondary" className="rounded-lg">
                        {medida.medidas_protetivas?.nome ?? "Medida"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDashboardDate(medida.created_at)}
                      </span>
                    </div>
                    {medida.observacoes ? (
                      <p className="text-sm leading-6 text-muted-foreground">
                        {medida.observacoes}
                      </p>
                    ) : null}
                    <p className="mt-2 text-xs text-muted-foreground">
                      Responsavel: {medida.profiles?.nome ?? "Nao informado"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="rounded-lg border bg-background p-3 text-sm text-muted-foreground">
                  Nenhuma medida protetiva aplicada ainda.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Novo encaminhamento</CardTitle>
              <CardDescription>
                Registre acoes tomadas durante o atendimento.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={createEncaminhamentoAction} className="space-y-4">
                <input type="hidden" name="chamado_id" value={chamado.id} />
                <div className="space-y-2">
                  <label
                    htmlFor="medida_protetiva_id"
                    className="text-sm font-medium"
                  >
                    Medida protetiva
                  </label>
                  <select
                    id="medida_protetiva_id"
                    name="medida_protetiva_id"
                    className="h-9 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <option value="">Sem medida vinculada</option>
                    {medidas.map((medida) => (
                      <option key={medida.id} value={medida.id}>
                        {medida.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="orgao_destino" className="text-sm font-medium">
                    Orgao destino
                  </label>
                  <input
                    id="orgao_destino"
                    name="orgao_destino"
                    className="h-9 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="data_encaminhamento"
                    className="text-sm font-medium"
                  >
                    Data
                  </label>
                  <input
                    id="data_encaminhamento"
                    name="data_encaminhamento"
                    type="datetime-local"
                    className="h-9 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="descricao" className="text-sm font-medium">
                    Descricao
                  </label>
                  <textarea
                    id="descricao"
                    name="descricao"
                    required
                    rows={5}
                    className="min-h-24 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Registrar encaminhamento
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Historico do chamado</CardTitle>
              <CardDescription>
                Encaminhamentos registrados para este atendimento.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {encaminhamentos.length > 0 ? (
                encaminhamentos.map((encaminhamento) => (
                  <div
                    key={encaminhamento.id}
                    className="rounded-lg border bg-background p-3"
                  >
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <Badge variant="secondary" className="rounded-lg">
                        {encaminhamento.medidas_protetivas?.nome ??
                          "Encaminhamento"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDashboardDate(
                          encaminhamento.data_encaminhamento
                        )}
                      </span>
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {encaminhamento.descricao}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Responsavel:{" "}
                      {encaminhamento.profiles?.nome ?? "Nao informado"}
                      {encaminhamento.orgao_destino
                        ? ` · Destino: ${encaminhamento.orgao_destino}`
                        : ""}
                    </p>
                  </div>
                ))
              ) : (
                <p className="rounded-lg border bg-background p-3 text-sm text-muted-foreground">
                  Nenhum encaminhamento registrado ainda.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
