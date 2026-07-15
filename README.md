# TCC Conselho Tutelar Next

Nova versao do TCC "Sistema Web para Gerenciamento de Denuncias Anonimas Online do Conselho Tutelar de Sao Borja".

Esta implementacao sera reconstruida do zero com Next.js, TypeScript, Supabase, Tailwind CSS e shadcn/ui, usando o projeto PHP de 2023 apenas como referencia de negocio.

## Estado Atual

O projeto esta com a base Next.js inicial criada pela Issue #1, a fundacao visual shadcn/ui criada pela Issue #2, os helpers Supabase criados pela Issue #3, o schema inicial versionado pela Issue #4, o formulario anonimo da Issue #8, o dashboard administrativo da Issue #9, a triagem Kanban da Issue #10, a criacao de chamados da Issue #11, a tela de chamados da Issue #12 e os encaminhamentos da Issue #13.

Documentacao principal:

- `ai.context.md`
- `docs/contexto-tcc-2023.md`
- `docs/decisao-arquitetura.md`
- `docs/seguranca-lgpd.md`
- `docs/superpowers/specs/2026-07-14-modernizacao-tcc-conselho-tutelar-design.md`
- `docs/superpowers/specs/2026-07-14-fluxo-branches-modelos-design.md`
- `docs/superpowers/specs/2026-07-14-supabase-config-design.md`
- `docs/superpowers/plans/2026-07-14-issues-01-02-base-next-ui.md`
- `docs/superpowers/plans/2026-07-14-issue-03-supabase-config.md`
- `docs/github-issues.md`
- `docs/issue-execution-log.md`

## Objetivo

Criar uma aplicacao publicavel e adequada para uso real pelo Conselho Tutelar, com denuncia anonima, painel privado, chamados, encaminhamentos, relatorios, auditoria e controles de seguranca.

## Estrutura Inicial

- `/`: base publica institucional.
- `/denuncia`: formulario publico de denuncia anonima.
- `/login`: acesso administrativo via Supabase Auth.
- `/admin`: dashboard administrativo protegido por login e profile ativo.
- `/admin/denuncias`: Kanban administrativo de triagem de denuncias.
- `/admin/denuncias/[id]`: detalhe protegido da denuncia com auditoria de leitura e criacao de chamado.
- `/admin/chamados`: listagem administrativa de chamados.
- `/admin/chamados/[id]`: detalhe protegido do chamado com alteracao de status e historico de encaminhamentos.
- `components/ui/`: componentes shadcn/ui adicionados para a fundacao visual.
- `lib/utils.ts`: utilitario base do shadcn/ui.
- `lib/supabase/`: helpers de configuracao e clientes Supabase para browser/server.
- `supabase/migrations/`: migrations SQL versionadas.
- `supabase/seed.sql`: seeds seguros de catalogos e dados institucionais genericos.

## Identidade Visual

A paleta aprovada usa fundo off-white quente, primaria verde/teal serena, secundaria azul suave e acento pessego discreto. A area publica deve parecer clara, tranquila e acolhedora para quem precisa realizar uma denuncia.

## Variaveis De Ambiente

Copie `.env.local.example` para `.env.local` e preencha quando o projeto Supabase existir:

```powershell
Copy-Item .env.local.example .env.local
```

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Nao coloque service role key, tokens privados ou credenciais reais em arquivos versionados.

## Como Rodar Localmente

```powershell
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Verificacoes

```powershell
npm run test
npm run lint
npm run build
```

## Banco Local Supabase

Quando Supabase CLI e Docker estiverem disponiveis, aplique migrations e seed localmente com:

```powershell
supabase db reset
```

A Issue #4 cria schema, constraints, indices e seeds seguros. A Issue #6 versiona RLS e policies.

## Autenticacao Administrativa

A area `/admin` exige sessao Supabase Auth e registro ativo em `profiles`.

Usuarios devem ser criados no Supabase Auth e vinculados manualmente em `profiles` ate existir uma tela administrativa de gestao de conselheiros.

## RLS E Policies

A migration `20260714000200_enable_rls_policies.sql` habilita RLS nas tabelas publicas do sistema. A area publica pode inserir denuncias, mas nao pode ler denuncias, vitimas, chamados, encaminhamentos ou audit logs. Leitura administrativa depende de profile ativo em `profiles`.

## Observacoes De Dependencias

Na instalacao inicial, `npm install` reportou 2 vulnerabilidades moderadas em dependencias transitivas. Nao foi executado `npm audit fix --force`, porque esse comando pode aplicar mudancas quebraveis fora do escopo da Issue #1.
