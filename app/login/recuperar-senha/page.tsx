import { ArrowLeft, MailCheck, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { requestPasswordResetAction } from "@/lib/auth/actions";
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

type RecuperarSenhaPageProps = {
  searchParams?: Promise<{
    error?: string;
    sent?: string;
  }>;
};

function getErrorMessage(error?: string) {
  if (error === "missing_email") {
    return "Informe o e-mail cadastrado.";
  }

  if (error === "reset_failed") {
    return "Nao foi possivel enviar o e-mail de recuperacao agora.";
  }

  return null;
}

export default async function RecuperarSenhaPage({
  searchParams,
}: RecuperarSenhaPageProps) {
  const params = await searchParams;
  const errorMessage = getErrorMessage(params?.error);
  const wasSent = params?.sent === "1";

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
            href="/login"
            className="inline-flex h-8 items-center justify-center gap-2 rounded-lg border bg-card px-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Voltar ao login
          </Link>
        </div>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-73px)] w-full max-w-5xl items-center gap-8 px-5 py-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <div className="mb-4 flex size-11 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
            <MailCheck className="size-5" aria-hidden="true" />
          </div>
          <h1 className="max-w-xl text-3xl font-semibold leading-tight">
            Recuperacao de senha.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
            Informe o e-mail do conselheiro cadastrado no Supabase Auth. O
            sistema enviara um link seguro para definir uma nova senha.
          </p>
        </div>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Enviar link de recuperacao</CardTitle>
            <CardDescription>
              O link sera enviado apenas para e-mails cadastrados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={requestPasswordResetAction} className="space-y-4">
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
              {errorMessage ? (
                <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {errorMessage}
                </p>
              ) : null}
              {wasSent ? (
                <p className="rounded-lg border border-primary/25 bg-primary/10 px-3 py-2 text-sm text-primary">
                  Se o e-mail estiver cadastrado, o link de recuperacao chegara
                  em instantes.
                </p>
              ) : null}
              <Button type="submit" className="w-full">
                Enviar link
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
