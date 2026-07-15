import {
  ArrowRight,
  Clock,
  ExternalLink,
  HeartHandshake,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getPublicConselheiros,
  getPublicConselhoInfo,
} from "@/lib/public/conselho";

const reasonsToReport = [
  "Violencia fisica, psicologica ou sexual",
  "Negligencia, abandono ou falta de cuidados",
  "Evasao escolar, trabalho infantil ou exploracao",
  "Uso abusivo de alcool, drogas ou situacoes de risco",
];

const supportSteps = [
  "O relato e recebido pelo Conselho Tutelar.",
  "A equipe verifica as informacoes e avalia a urgencia.",
  "Quando necessario, o atendimento e encaminhado para a rede de protecao.",
];

export default async function Home() {
  const [conselho, conselheiros] = await Promise.all([
    getPublicConselhoInfo(),
    getPublicConselheiros(),
  ]);

  const contactCards = [
    {
      title: "Localizacao",
      value: conselho.fullAddress,
      icon: MapPin,
      href: conselho.mapUrl,
    },
    {
      title: "Telefone",
      value: conselho.phone,
      icon: Phone,
      href: conselho.phone.startsWith("Contato") ? null : `tel:${conselho.phone}`,
    },
    {
      title: "WhatsApp",
      value: conselho.whatsappLabel,
      icon: MessageCircle,
      href: conselho.whatsappLabel.startsWith("WhatsApp")
        ? null
        : `https://wa.me/${conselho.whatsappLabel.replace(/\D/g, "")}`,
    },
    {
      title: "E-mail",
      value: conselho.email,
      icon: Mail,
      href: conselho.email.includes("@") ? `mailto:${conselho.email}` : null,
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-card/90">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/" className="flex items-center gap-3" aria-label="Inicio">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold leading-tight">
              {conselho.name}
              <span className="block text-xs font-normal text-muted-foreground">
                {conselho.cityLabel}
              </span>
            </span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm text-muted-foreground md:flex">
            <a className="hover:text-foreground" href="#quando-procurar">
              Quando procurar
            </a>
            <a className="hover:text-foreground" href="#contatos">
              Contatos
            </a>
            <Link className="hover:text-foreground" href="/admin">
              Area administrativa
            </Link>
          </nav>
        </div>
      </header>

      <section className="border-b bg-[linear-gradient(180deg,var(--card),var(--background))]">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <div className="flex flex-col justify-center">
            <Badge
              variant="outline"
              className="mb-5 w-fit rounded-lg border-primary/20 bg-primary/8 text-primary"
            >
              Canal de protecao a criancas e adolescentes
            </Badge>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
              {conselho.name}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
              Envie uma denuncia anonima ou encontre os canais de atendimento
              do Conselho Tutelar. O objetivo e proteger criancas e adolescentes
              com acolhimento, responsabilidade e sigilo.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/denuncia"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85"
              >
                Fazer denuncia anonima
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <a
                href="#contatos"
                className="inline-flex h-10 items-center justify-center rounded-lg border bg-card px-4 text-sm font-medium transition-colors hover:bg-muted"
              >
                Ver contatos
              </a>
            </div>
          </div>

          <Card className="rounded-lg border-primary/15 bg-card shadow-sm shadow-primary/5">
            <CardHeader>
              <CardTitle>Atendimento do Conselho</CardTitle>
              <CardDescription>
                Procure o Conselho quando houver suspeita ou conhecimento de
                violacao de direitos de criancas e adolescentes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {supportSteps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-start gap-3 rounded-lg border bg-muted/45 px-3 py-3"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-secondary text-xs font-semibold text-secondary-foreground">
                    {index + 1}
                  </span>
                  <span className="text-sm leading-6">{step}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section
        id="quando-procurar"
        className="mx-auto w-full max-w-6xl px-5 py-12"
      >
        <div className="mb-6 flex flex-col gap-2">
          <h2 className="text-2xl font-semibold">Quando procurar o Conselho</h2>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            A denuncia pode ser feita quando uma crianca ou adolescente estiver
            em situacao de risco, violencia, abandono, negligencia ou violacao
            de direitos.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {reasonsToReport.map((reason) => (
            <Card key={reason} className="rounded-lg">
              <CardHeader className="flex flex-row items-start gap-3 space-y-0">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <HeartHandshake className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <CardTitle className="text-base">{reason}</CardTitle>
                  <CardDescription>
                    Se houver duvida, relate o que sabe. A equipe avaliara as
                    informacoes recebidas.
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section id="contatos" className="border-y bg-secondary/35">
        <div className="mx-auto w-full max-w-6xl px-5 py-12">
          <div className="mb-6 flex flex-col gap-2">
            <Badge variant="secondary" className="w-fit rounded-lg">
              Atendimento presencial e canais oficiais
            </Badge>
            <h2 className="text-2xl font-semibold">Contatos do Conselho</h2>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              Use os canais oficiais para buscar orientacao, confirmar horarios
              de atendimento ou enviar informacoes complementares.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {contactCards.map((contact) => {
              const Icon = contact.icon;
              const content = (
                <Card className="h-full rounded-lg transition-colors hover:bg-muted/40">
                  <CardHeader>
                    <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-card text-primary ring-1 ring-border">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-base">{contact.title}</CardTitle>
                    <CardDescription>{contact.value}</CardDescription>
                  </CardHeader>
                </Card>
              );

              return contact.href ? (
                <a key={contact.title} href={contact.href}>
                  {content}
                </a>
              ) : (
                <div key={contact.title}>{content}</div>
              );
            })}
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Card className="rounded-lg">
              <CardHeader className="flex flex-row items-start gap-3 space-y-0">
                <Clock className="mt-1 size-5 text-primary" aria-hidden="true" />
                <div>
                  <CardTitle className="text-base">Horario</CardTitle>
                  <CardDescription>{conselho.hours}</CardDescription>
                </div>
              </CardHeader>
            </Card>
            {conselho.socialLinks.map((link) => {
              return (
                <a key={link.label} href={link.href}>
                  <Card className="rounded-lg transition-colors hover:bg-muted/40">
                    <CardHeader className="flex flex-row items-start gap-3 space-y-0">
                      <ExternalLink
                        className="mt-1 size-5 text-primary"
                        aria-hidden="true"
                      />
                      <div>
                        <CardTitle className="text-base">{link.label}</CardTitle>
                        <CardDescription>Acompanhe o canal oficial.</CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-12">
        <div className="mb-6 flex flex-col gap-2">
          <h2 className="text-2xl font-semibold">Equipe do Conselho</h2>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Conselheiros disponíveis para atendimento e acompanhamento das
            situações encaminhadas ao Conselho Tutelar.
          </p>
        </div>
        {conselheiros.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {conselheiros.map((conselheiro) => (
              <Card key={conselheiro.id} className="rounded-lg">
                <CardHeader>
                  {conselheiro.fotoUrl ? (
                    <Image
                      src={conselheiro.fotoUrl}
                      alt={conselheiro.nome}
                      width={64}
                      height={64}
                      className="mb-3 size-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="mb-3 flex size-12 items-center justify-center rounded-lg bg-secondary text-sm font-semibold text-secondary-foreground">
                      {conselheiro.nome.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <CardTitle className="text-lg">{conselheiro.nome}</CardTitle>
                  <CardDescription>{conselheiro.cargo}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  {conselheiro.mandato ? (
                    <p>Mandato: {conselheiro.mandato}</p>
                  ) : null}
                  {conselheiro.sobre ? <p>{conselheiro.sobre}</p> : null}
                  {conselheiro.telefoneFixo ? (
                    <p>Fixo: {conselheiro.telefoneFixo}</p>
                  ) : null}
                  {conselheiro.telefonePlantao ? (
                    <p>Plantao: {conselheiro.telefonePlantao}</p>
                  ) : conselheiro.telefone ? (
                    <p>{conselheiro.telefone}</p>
                  ) : null}
                  {conselheiro.email ? <p>{conselheiro.email}</p> : null}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
            A equipe sera exibida assim que os conselheiros forem cadastrados
            para visualizacao publica.
          </p>
        )}
      </section>

      <footer className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>{conselho.name}</span>
        <span className="inline-flex items-center gap-2">
          <MapPin className="size-4" aria-hidden="true" />
          {conselho.cityLabel}
        </span>
      </footer>
    </main>
  );
}
