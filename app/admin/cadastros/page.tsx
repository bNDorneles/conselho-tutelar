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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signOutAction } from "@/lib/auth/actions";
import {
  createMedidaAction,
  createMotivoAction,
  getAdminCadastrosData,
  requireActiveAdminProfile,
  toggleCadastroAction,
  updateConselhoAction,
} from "@/lib/admin/cadastros";

export const dynamic = "force-dynamic";

function ToggleForm({
  table,
  id,
  ativo,
}: {
  table: string;
  id: string;
  ativo: boolean;
}) {
  return (
    <form action={toggleCadastroAction}>
      <input type="hidden" name="table" value={table} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="ativo" value={String(ativo)} />
      <Button type="submit" variant="outline" size="sm">
        {ativo ? "Desativar" : "Ativar"}
      </Button>
    </form>
  );
}

export default async function CadastrosPage() {
  const profile = await requireActiveAdminProfile();
  const { motivos, medidas, profiles, conselho } = await getAdminCadastrosData();

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4">
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

      <section className="mx-auto w-full max-w-6xl px-5 py-8">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge className="mb-4 rounded-lg bg-primary text-primary-foreground">
              Cadastros auxiliares
            </Badge>
            <h1 className="text-3xl font-semibold leading-tight">
              Manutencoes administrativas.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Gerencie dados de apoio usados pelos formularios e pelo
              atendimento.
            </p>
          </div>
          <Link
            href="/admin"
            className="inline-flex h-8 items-center justify-center rounded-lg border bg-card px-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            Voltar ao painel
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Motivos de denuncia</CardTitle>
              <CardDescription>Categorias usadas no formulario publico.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form action={createMotivoAction} className="grid gap-3">
                <Input name="nome" placeholder="Nome do motivo" required />
                <Input name="descricao" placeholder="Descricao opcional" />
                <Button type="submit">Adicionar motivo</Button>
              </form>
              <div className="space-y-2">
                {motivos.map((motivo) => (
                  <div
                    key={motivo.id}
                    className="flex items-center justify-between gap-3 rounded-lg border bg-background p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{motivo.nome}</p>
                      <p className="text-xs text-muted-foreground">
                        {motivo.ativo ? "Ativo" : "Inativo"}
                      </p>
                    </div>
                    <ToggleForm
                      table="motivos_denuncia"
                      id={motivo.id}
                      ativo={motivo.ativo}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Medidas protetivas</CardTitle>
              <CardDescription>Medidas usadas em encaminhamentos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form action={createMedidaAction} className="grid gap-3">
                <Input name="nome" placeholder="Nome da medida" required />
                <Input name="descricao" placeholder="Descricao opcional" />
                <Button type="submit">Adicionar medida</Button>
              </form>
              <div className="space-y-2">
                {medidas.map((medida) => (
                  <div
                    key={medida.id}
                    className="flex items-center justify-between gap-3 rounded-lg border bg-background p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{medida.nome}</p>
                      <p className="text-xs text-muted-foreground">
                        {medida.ativo ? "Ativa" : "Inativa"}
                      </p>
                    </div>
                    <ToggleForm
                      table="medidas_protetivas"
                      id={medida.id}
                      ativo={medida.ativo}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Dados institucionais</CardTitle>
              <CardDescription>Informacoes do Conselho Tutelar.</CardDescription>
            </CardHeader>
            <CardContent>
              {conselho ? (
                <form action={updateConselhoAction} className="grid gap-3">
                  <input type="hidden" name="id" value={conselho.id} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome</Label>
                      <Input id="nome" name="nome" defaultValue={conselho.nome} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="municipio">Municipio</Label>
                      <Input
                        id="municipio"
                        name="municipio"
                        defaultValue={conselho.municipio}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="uf">UF</Label>
                      <Input id="uf" name="uf" defaultValue={conselho.uf} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        name="telefone"
                        defaultValue={conselho.telefone ?? ""}
                      />
                    </div>
                  </div>
                  <Input
                    name="endereco"
                    defaultValue={conselho.endereco ?? ""}
                    placeholder="Endereco"
                  />
                  <Input
                    name="email"
                    defaultValue={conselho.email ?? ""}
                    placeholder="Email"
                  />
                  <Input
                    name="horario_atendimento"
                    defaultValue={conselho.horario_atendimento ?? ""}
                    placeholder="Horario de atendimento"
                  />
                  <Button type="submit">Salvar dados</Button>
                </form>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Dados institucionais ainda nao cadastrados.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Perfis administrativos</CardTitle>
              <CardDescription>
                Usuarios Auth devem ser criados no Supabase; aqui controlamos o
                perfil ativo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {profiles.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-lg border bg-background p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{item.nome}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.role} · {item.ativo ? "Ativo" : "Inativo"}
                    </p>
                  </div>
                  <ToggleForm table="profiles" id={item.id} ativo={item.ativo} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
