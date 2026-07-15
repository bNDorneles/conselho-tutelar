import { ArrowLeft, LockKeyhole, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { signInWithPasswordAction } from "@/lib/auth/actions";
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

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

function getErrorMessage(error?: string) {
  if (error === "missing_credentials") {
    return "Informe e-mail e senha para acessar.";
  }

  if (error === "invalid_credentials") {
    return "Nao foi possivel entrar com esses dados.";
  }

  return null;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const errorMessage = getErrorMessage(params?.error);

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-3 text-sm font-semibold">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </span>
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

      <section className="mx-auto grid min-h-[calc(100vh-73px)] w-full max-w-5xl items-center gap-8 px-5 py-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <div className="mb-4 flex size-11 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
            <LockKeyhole className="size-5" aria-hidden="true" />
          </div>
          <h1 className="max-w-xl text-3xl font-semibold leading-tight">
            Acesso administrativo protegido.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
            Esta area e exclusiva para conselheiros e administradores
            autorizados. Denuncias e chamados ficam protegidos por login,
            perfil ativo e politicas de acesso no banco.
          </p>
        </div>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Entrar no painel</CardTitle>
            <CardDescription>
              Use o e-mail cadastrado no Supabase Auth.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={signInWithPasswordAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </div>
              {errorMessage ? (
                <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {errorMessage}
                </p>
              ) : null}
              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

