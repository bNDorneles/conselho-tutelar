import { AlertCircle, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { submitDenunciaAction } from "@/lib/denuncias/actions";
import { createServerSupabaseClient } from "@/lib/supabase/server";
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
import { Textarea } from "@/components/ui/textarea";

export const dynamic = "force-dynamic";

type DenunciaPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

async function getMotivos() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("motivos_denuncia")
    .select("id,nome,descricao")
    .eq("ativo", true)
    .order("nome");

  if (error) {
    throw new Error("Nao foi possivel carregar os motivos de denuncia.");
  }

  return data;
}

function getErrorMessage(error?: string) {
  if (!error) {
    return null;
  }

  if (error === "nao_foi_possivel_enviar") {
    return "Nao foi possivel enviar a denuncia agora. Tente novamente em alguns instantes.";
  }

  return decodeURIComponent(error);
}

export default async function DenunciaPage({ searchParams }: DenunciaPageProps) {
  const [params, motivos] = await Promise.all([searchParams, getMotivos()]);
  const errorMessage = getErrorMessage(params?.error);

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-sm font-semibold">
            Conselho Tutelar
          </Link>
          <Link
            href="/"
            className="inline-flex h-8 items-center justify-center gap-2 rounded-lg border bg-card px-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Voltar ao inicio
          </Link>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-5xl gap-8 px-5 py-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <div className="mb-4 flex size-11 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-semibold leading-tight">
            Enviar denuncia anonima.
          </h1>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Informe o que aconteceu com o maximo de detalhes que voce souber.
            Os dados da crianca ou adolescente ajudam a equipe a localizar e
            avaliar a situacao, mas preencha apenas o que souber.
          </p>
          <Card className="mt-6 rounded-lg border-primary/15 bg-secondary/30">
            <CardContent className="pt-6 text-sm leading-6 text-muted-foreground">
              Em situacoes de risco imediato, procure atendimento emergencial
              pelos canais oficiais da sua cidade.
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Relato da situacao</CardTitle>
            <CardDescription>
              O formulario continua anonimo. Campos sobre a vitima sao
              opcionais quando voce nao souber a informacao.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={submitDenunciaAction} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="motivo_id">Motivo</Label>
                <select
                  id="motivo_id"
                  name="motivo_id"
                  required
                  className="h-9 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">Selecione um motivo</option>
                  {motivos.map((motivo) => (
                    <option key={motivo.id} value={motivo.id}>
                      {motivo.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="relato">Relato</Label>
                <Textarea
                  id="relato"
                  name="relato"
                  required
                  minLength={20}
                  maxLength={4000}
                  rows={7}
                  placeholder="Descreva a situacao, quando aconteceu, onde ocorreu e quem pode estar em risco."
                />
              </div>

              <div className="space-y-3">
                <div>
                  <h2 className="text-sm font-semibold">Dados da vitima</h2>
                  <p className="text-xs leading-5 text-muted-foreground">
                    Informe os dados da crianca ou adolescente quando souber.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="vitima_nome_informado">Nome da vitima</Label>
                    <Input
                      id="vitima_nome_informado"
                      name="vitima_nome_informado"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vitima_idade_informada">
                      Idade aproximada
                    </Label>
                    <Input
                      id="vitima_idade_informada"
                      name="vitima_idade_informada"
                      type="number"
                      min={0}
                      max={17}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vitima_genero_informado">Genero</Label>
                    <select
                      id="vitima_genero_informado"
                      name="vitima_genero_informado"
                      className="h-9 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <option value="">Nao informado</option>
                      <option value="feminino">Feminino</option>
                      <option value="masculino">Masculino</option>
                      <option value="outro">Outro</option>
                      <option value="nao_informado">Prefiro nao informar</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vitima_escola_informada">Escola</Label>
                    <Input
                      id="vitima_escola_informada"
                      name="vitima_escola_informada"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h2 className="text-sm font-semibold">
                    Familia e localizacao
                  </h2>
                  <p className="text-xs leading-5 text-muted-foreground">
                    Esses dados ajudam na triagem quando a equipe precisar
                    confirmar informacoes.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="vitima_nome_pai_informado">
                      Nome do pai
                    </Label>
                    <Input
                      id="vitima_nome_pai_informado"
                      name="vitima_nome_pai_informado"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vitima_nome_mae_informado">
                      Nome da mae
                    </Label>
                    <Input
                      id="vitima_nome_mae_informado"
                      name="vitima_nome_mae_informado"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vitima_endereco_informado">
                      Endereco/local da vitima
                    </Label>
                    <Input
                      id="vitima_endereco_informado"
                      name="vitima_endereco_informado"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="local_ocorrencia">Local da ocorrencia</Label>
                    <Input id="local_ocorrencia" name="local_ocorrencia" />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <p className="rounded-lg border bg-muted/45 px-3 py-2 text-xs leading-5 text-muted-foreground">
                    Se alguma informacao estiver incompleta, envie mesmo assim.
                    O Conselho avaliara o relato recebido.
                  </p>
                </div>
              </div>

              {errorMessage ? (
                <p className="flex gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 size-4" aria-hidden="true" />
                  {errorMessage}
                </p>
              ) : null}

              <Button type="submit" className="w-full">
                Enviar denuncia
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

