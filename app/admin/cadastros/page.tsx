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
import {
  createMedidaAction,
  createMotivoAction,
  getAdminCadastrosData,
  requireActiveAdminProfile,
  toggleCadastroAction,
  updateCatalogItemAction,
  updateConselhoAction,
  upsertConselheiroAction,
} from "@/lib/admin/cadastros";
import { getAreaAccent } from "@/lib/admin/visual-status";

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

function CatalogEditor({
  table,
  items,
  title,
}: {
  table: "motivos_denuncia" | "medidas_protetivas";
  items: Array<{
    id: string;
    nome: string;
    descricao: string | null;
    ativo: boolean;
  }>;
  title: string;
}) {
  const activeCount = items.filter((item) => item.ativo).length;
  const inactiveCount = items.length - activeCount;

  return (
    <details
      className="rounded-lg border bg-background p-3"
      open={items.length <= 4}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <span className="text-sm font-semibold">{title}</span>
        <span className="text-xs text-muted-foreground">
          {activeCount} ativos · {inactiveCount} inativos
        </span>
      </summary>
      <div className="mt-3 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border bg-card p-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 space-y-1">
                <p className="break-words text-sm font-semibold">{item.nome}</p>
                <p className="break-words text-sm leading-6 text-muted-foreground">
                  {item.descricao || "Sem descricao cadastrada."}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.ativo ? "Ativo" : "Inativo"}
                </p>
              </div>
              <ToggleForm table={table} id={item.id} ativo={item.ativo} />
            </div>
            <details className="mt-3 rounded-lg border bg-background p-3">
              <summary className="cursor-pointer list-none text-sm font-medium text-primary">
                Editar nome e descricao
              </summary>
              <form action={updateCatalogItemAction} className="mt-3 grid gap-3">
                <input type="hidden" name="table" value={table} />
                <input type="hidden" name="id" value={item.id} />
                <Input name="nome" defaultValue={item.nome} required />
                <textarea
                  name="descricao"
                  defaultValue={item.descricao ?? ""}
                  placeholder="Descricao opcional"
                  className="min-h-24 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
                <Button type="submit" size="sm" className="w-fit">
                  Salvar alteracoes
                </Button>
              </form>
            </details>
          </div>
        ))}
      </div>
    </details>
  );
}

export default async function CadastrosPage() {
  await requireActiveAdminProfile();
  const { motivos, medidas, profiles, conselho } = await getAdminCadastrosData();
  const areaAccent = getAreaAccent("cadastros");

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto w-full max-w-6xl px-5 py-8">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge
              variant="outline"
              className={`mb-4 rounded-lg ${areaAccent.className}`}
            >
              {areaAccent.label}
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
          <Card id="motivos" className="scroll-mt-6 rounded-lg">
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
              <CatalogEditor
                table="motivos_denuncia"
                items={motivos}
                title="Motivos cadastrados"
              />
            </CardContent>
          </Card>

          <Card id="medidas" className="scroll-mt-6 rounded-lg">
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
              <CatalogEditor
                table="medidas_protetivas"
                items={medidas}
                title="Medidas cadastradas"
              />
            </CardContent>
          </Card>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <Card id="conselho" className="scroll-mt-6 rounded-lg">
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
                    name="whatsapp"
                    defaultValue={conselho.whatsapp ?? ""}
                    placeholder="WhatsApp"
                  />
                  <Input
                    name="facebook_url"
                    defaultValue={conselho.facebook_url ?? ""}
                    placeholder="Facebook"
                  />
                  <Input
                    name="instagram_url"
                    defaultValue={conselho.instagram_url ?? ""}
                    placeholder="Instagram"
                  />
                  <Input
                    name="mapa_url"
                    defaultValue={conselho.mapa_url ?? ""}
                    placeholder="Link do mapa"
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

          <Card id="conselheiros" className="scroll-mt-6 rounded-lg">
            <CardHeader>
              <CardTitle>Conselheiros</CardTitle>
              <CardDescription>
                Crie o usuario no Supabase Auth e cadastre aqui o perfil publico
                e administrativo usando o UID.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form
                action={upsertConselheiroAction}
                className="grid gap-3"
                encType="multipart/form-data"
              >
                <Input name="id" placeholder="UID do usuario no Supabase Auth" required />
                <Input name="nome" placeholder="Nome do conselheiro" required />
                <Input name="email" type="email" placeholder="Email" />
                <Input name="telefone_fixo" placeholder="Telefone fixo" />
                <Input name="telefone_plantao" placeholder="Telefone plantao / WhatsApp" />
                <Input name="cargo" placeholder="Cargo" />
                <Input
                  name="mandato"
                  placeholder="Mandato"
                  defaultValue="2024-2028"
                />
                <Input name="foto" type="file" accept="image/png,image/jpeg" />
                <Input name="foto_url" placeholder="URL da foto alternativa" />
                <Input name="sobre" placeholder="Resumo publico" />
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    name="exibir_publico"
                    value="true"
                    className="size-4"
                  />
                  Exibir na area publica
                </label>
                <Button type="submit">Salvar conselheiro</Button>
              </form>
              <div className="space-y-2">
                {profiles.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-lg border bg-background p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{item.nome}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.role} · {item.ativo ? "Ativo" : "Inativo"}
                        {item.exibir_publico ? " · Publico" : ""}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.telefone_fixo ? `Fixo: ${item.telefone_fixo}` : ""}
                        {item.telefone_fixo && item.telefone_plantao ? " · " : ""}
                        {item.telefone_plantao
                          ? `Plantao: ${item.telefone_plantao}`
                          : ""}
                      </p>
                    </div>
                    <ToggleForm table="profiles" id={item.id} ativo={item.ativo} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
