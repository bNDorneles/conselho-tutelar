import {
  ArrowRight,
  FileText,
  HeartHandshake,
  LockKeyhole,
  MapPin,
  ShieldCheck,
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
import { Separator } from "@/components/ui/separator";

const serviceCards = [
  {
    title: "Denuncia anonima",
    description:
      "Canal publico para relatar situacoes que envolvem direitos de criancas e adolescentes.",
    icon: ShieldCheck,
  },
  {
    title: "Triagem interna",
    description:
      "Painel privado para conselheiros analisarem relatos e organizarem atendimentos.",
    icon: FileText,
  },
  {
    title: "Encaminhamentos",
    description:
      "Registro de medidas, responsaveis e historico do acompanhamento de cada caso.",
    icon: HeartHandshake,
  },
];

const statusItems = [
  "Recebida",
  "Em analise",
  "Convertida em chamado",
  "Arquivada",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-card/90">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/" className="flex items-center gap-3" aria-label="Inicio">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold leading-tight">
              Conselho Tutelar
              <span className="block text-xs font-normal text-muted-foreground">
                Sao Borja
              </span>
            </span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm text-muted-foreground md:flex">
            <a className="hover:text-foreground" href="#quando-denunciar">
              Quando denunciar
            </a>
            <a className="hover:text-foreground" href="#fluxo">
              Fluxo
            </a>
            <Link className="hover:text-foreground" href="/admin">
              Area administrativa
            </Link>
          </nav>
        </div>
      </header>

      <section className="border-b bg-[linear-gradient(180deg,var(--card),var(--background))]">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
          <div className="flex flex-col justify-center">
            <Badge
              variant="outline"
              className="mb-5 w-fit rounded-lg border-primary/20 bg-primary/8 text-primary"
            >
              Canal seguro e acolhedor
            </Badge>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
              Sistema de denuncias anonimas para o Conselho Tutelar.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
              Uma aplicacao web para receber relatos com privacidade e apoiar o
              acompanhamento interno de denuncias, chamados e encaminhamentos.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#quando-denunciar"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85"
              >
                Entender o fluxo
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
              <Link
                href="/admin"
                className="inline-flex h-10 items-center justify-center rounded-lg border bg-card px-4 text-sm font-medium transition-colors hover:bg-muted"
              >
                Ver base administrativa
              </Link>
            </div>
          </div>

          <Card className="rounded-lg border-primary/15 bg-card shadow-sm shadow-primary/5">
            <CardHeader>
              <CardTitle>Fluxo protegido desde a entrada</CardTitle>
              <CardDescription>
                A area publica envia relatos. A area interna analisa sem expor
                dados sensiveis.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-3">
                {statusItems.map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-lg border bg-muted/45 px-3 py-2"
                  >
                    <span className="flex size-7 items-center justify-center rounded-md bg-secondary text-xs font-semibold text-secondary-foreground">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <LockKeyhole className="mt-0.5 size-4 text-primary" />
                <p>
                  A leitura de denuncias sera restrita ao painel autenticado
                  quando Supabase Auth e RLS forem implementados.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="quando-denunciar" className="mx-auto w-full max-w-6xl px-5 py-12">
        <div className="mb-6 flex flex-col gap-2">
          <h2 className="text-2xl font-semibold">Base funcional do sistema</h2>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Esta primeira interface organiza o produto em canais claros para a
            area publica e para o atendimento interno.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {serviceCards.map((card) => {
            const Icon = card.icon;

            return (
              <Card key={card.title} className="rounded-lg">
                <CardHeader>
                  <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      <section id="fluxo" className="border-y bg-secondary/35">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Badge variant="secondary" className="mb-4 rounded-lg">
              Proxima etapa publica
            </Badge>
            <h2 className="text-2xl font-semibold">Denuncia anonima</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              O formulario publico sera implementado depois da configuracao do
              Supabase, para garantir validacao e gravacao seguras desde o
              inicio.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Coleta minima de dados",
              "Relato protegido",
              "Triagem por conselheiro",
              "Auditoria de acoes sensiveis",
            ].map((item) => (
              <div key={item} className="rounded-lg border bg-card p-4">
                <p className="text-sm font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>Conselho Tutelar de Sao Borja</span>
        <span className="inline-flex items-center gap-2">
          <MapPin className="size-4" aria-hidden="true" />
          Sistema em modernizacao academica
        </span>
      </footer>
    </main>
  );
}
