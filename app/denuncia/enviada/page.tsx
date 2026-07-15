import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DenunciaEnviadaPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-10">
      <Card className="w-full max-w-xl rounded-lg">
        <CardHeader>
          <div className="mb-3 flex size-11 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
            <CheckCircle2 className="size-5" aria-hidden="true" />
          </div>
          <CardTitle>Denuncia enviada</CardTitle>
          <CardDescription>
            O relato foi recebido pelo sistema. Nenhum dado interno sera exibido
            nesta area publica.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/"
            className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Voltar para o inicio
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
