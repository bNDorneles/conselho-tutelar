import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye } from "lucide-react";

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
import { signOutAction } from "@/lib/auth/actions";
import {
  denunciaStatusLabels,
  getAdminDenunciaDetail,
  recordDenunciaRead,
} from "@/lib/admin/denuncias";
import {
  canCreateChamadoFromDenuncia,
  createChamadoFromDenunciaAction,
} from "@/lib/admin/chamados";
import { formatDashboardDate } from "@/lib/admin/dashboard";

export const dynamic = "force-dynamic";

type DenunciaDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    error?: string;
    success?: string;
  }>;
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

export default async function DenunciaDetailPage({
  params,
  searchParams,
}: DenunciaDetailPageProps) {
  const profile = await requireAdminProfile();
  const { id } = await params;
  const query = await searchParams;
  const denuncia = await getAdminDenunciaDetail(id);

  if (!denuncia) {
    notFound();
  }

  await recordDenunciaRead(profile.id, denuncia.id);
  const canCreateChamado = canCreateChamadoFromDenuncia(denuncia);
  const showSuccess = query?.success === "chamado_criado";
  const showError = Boolean(query?.error);

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-4">
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

      <section className="mx-auto w-full max-w-5xl px-5 py-8">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge className="mb-4 rounded-lg bg-primary text-primary-foreground">
              Detalhe da denuncia
            </Badge>
            <h1 className="text-3xl font-semibold leading-tight">
              Analise do relato.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Esta abertura foi registrada na auditoria como leitura
              administrativa.
            </p>
          </div>
          <Link
            href="/admin/denuncias"
            className="inline-flex h-8 items-center justify-center gap-2 rounded-lg border bg-card px-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Voltar ao Kanban
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="size-4 text-primary" aria-hidden="true" />
                Relato completo
              </CardTitle>
              <CardDescription>
                Recebido em {formatDashboardDate(denuncia.created_at)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                {denuncia.relato}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Dados da triagem</CardTitle>
              <CardDescription>
                Informacoes usadas para analise inicial.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <DetailItem
                label="Status"
                value={denunciaStatusLabels[denuncia.status]}
              />
              <DetailItem
                label="Motivo"
                value={denuncia.motivos_denuncia?.nome ?? null}
              />
              <DetailItem
                label="Local da ocorrencia"
                value={denuncia.local_ocorrencia}
              />
              <DetailItem
                label="Atualizada em"
                value={formatDashboardDate(denuncia.updated_at)}
              />
            </CardContent>
          </Card>
        </div>

        <Card className="mt-5 rounded-lg border-primary/20">
          <CardHeader>
            <CardTitle>Criar chamado</CardTitle>
            <CardDescription>
              Formalize o atendimento interno vinculado a esta denuncia.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {showSuccess ? (
              <p className="rounded-lg border border-primary/20 bg-primary/8 px-3 py-2 text-sm text-primary">
                Chamado criado e denuncia marcada como convertida.
              </p>
            ) : null}
            {showError ? (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                Nao foi possivel criar o chamado para esta denuncia.
              </p>
            ) : null}
            {canCreateChamado ? (
              <form action={createChamadoFromDenunciaAction}>
                <input type="hidden" name="denuncia_id" value={denuncia.id} />
                <Button type="submit">Criar chamado</Button>
              </form>
            ) : (
              <p className="rounded-lg border bg-background p-3 text-sm text-muted-foreground">
                Esta denuncia ja foi convertida em chamado.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="mt-5 rounded-lg">
          <CardHeader>
            <CardTitle>Dados opcionais da vitima</CardTitle>
            <CardDescription>
              Campos informados anonimamente quando a pessoa denunciante soube
              responder.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <DetailItem
              label="Nome informado"
              value={denuncia.vitima_nome_informado}
            />
            <DetailItem
              label="Idade aproximada"
              value={denuncia.vitima_idade_informada}
            />
            <DetailItem
              label="Endereco/local"
              value={denuncia.vitima_endereco_informado}
            />
            <DetailItem
              label="Observacoes internas"
              value={denuncia.observacoes_internas}
            />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
