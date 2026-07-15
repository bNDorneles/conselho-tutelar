import { ArrowLeft, KeyRound, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { updatePasswordAction } from "@/lib/auth/actions";
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

type RedefinirSenhaPageProps = {
  searchParams?: Promise<{
    code?: string;
    error?: string;
  }>;
};

function getErrorMessage(error?: string) {
  if (error === "weak_password") {
    return "Use uma senha com pelo menos 8 caracteres.";
  }

  if (error === "password_mismatch") {
    return "A confirmacao precisa ser igual a nova senha.";
  }

  if (error === "invalid_link") {
    return "O link de recuperacao esta invalido ou expirou.";
  }

  if (error === "update_failed") {
    return "Nao foi possivel atualizar a senha agora.";
  }

  return null;
}

export default async function RedefinirSenhaPage({
  searchParams,
}: RedefinirSenhaPageProps) {
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
            <KeyRound className="size-5" aria-hidden="true" />
          </div>
          <h1 className="max-w-xl text-3xl font-semibold leading-tight">
            Defina uma nova senha.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
            Use uma senha segura para acessar novamente o painel interno do
            Conselho Tutelar.
          </p>
        </div>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Nova senha</CardTitle>
            <CardDescription>
              A nova senha sera aplicada ao usuario autenticado pelo link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updatePasswordAction} className="space-y-4">
              <input type="hidden" name="code" value={params?.code ?? ""} />
              <div className="space-y-2">
                <Label htmlFor="password">Nova senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password_confirmation">Confirmar senha</Label>
                <Input
                  id="password_confirmation"
                  name="password_confirmation"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>
              {errorMessage ? (
                <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {errorMessage}
                </p>
              ) : null}
              <Button type="submit" className="w-full">
                Salvar nova senha
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
