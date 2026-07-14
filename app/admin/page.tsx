import {
  ClipboardList,
  FileWarning,
  LockKeyhole,
  UserRoundCheck,
} from "lucide-react";
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
import { requireAdminProfile } from "@/lib/auth/admin";
import { signOutAction } from "@/lib/auth/actions";

export const dynamic = "force-dynamic";

const adminCards = [
  {
    title: "Denuncias",
    description: "Triagem dos relatos recebidos pelo canal publico.",
    icon: FileWarning,
  },
  {
    title: "Chamados",
    description: "Acompanhamento dos casos formalizados por conselheiros.",
    icon: ClipboardList,
  },
  {
    title: "Conselheiros",
    description: "Base visual para gestao de perfis administrativos.",
    icon: UserRoundCheck,
  },
];

export default async function AdminPage() {
  const profile = await requireAdminProfile();

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-sm font-semibold">
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
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {adminCards.map((card) => {
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

        <Card className="mt-6 rounded-lg border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LockKeyhole className="size-4 text-primary" aria-hidden="true" />
              Seguranca como requisito de proximas issues
            </CardTitle>
            <CardDescription>
              A area administrativa ficara protegida por Supabase Auth e Row
              Level Security antes de acessar denuncias reais.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 text-sm sm:grid-cols-3">
              <span className="rounded-lg border bg-background p-3">
                Auth obrigatoria
              </span>
              <span className="rounded-lg border bg-background p-3">
                Perfis conselheiro/admin
              </span>
              <span className="rounded-lg border bg-background p-3">
                Auditoria de acesso
              </span>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
