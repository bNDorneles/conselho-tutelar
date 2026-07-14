# TCC Conselho Tutelar Next

Nova versao do TCC "Sistema Web para Gerenciamento de Denuncias Anonimas Online do Conselho Tutelar de Sao Borja".

Esta implementacao sera reconstruida do zero com Next.js, TypeScript, Supabase, Tailwind CSS e shadcn/ui, usando o projeto PHP de 2023 apenas como referencia de negocio.

## Estado Atual

O projeto esta com a base Next.js inicial criada pela Issue #1.

Documentacao principal:

- `ai.context.md`
- `docs/contexto-tcc-2023.md`
- `docs/decisao-arquitetura.md`
- `docs/seguranca-lgpd.md`
- `docs/superpowers/specs/2026-07-14-modernizacao-tcc-conselho-tutelar-design.md`
- `docs/superpowers/specs/2026-07-14-fluxo-branches-modelos-design.md`
- `docs/superpowers/plans/2026-07-14-issues-01-02-base-next-ui.md`
- `docs/github-issues.md`
- `docs/issue-execution-log.md`

## Objetivo

Criar uma aplicacao publicavel e adequada para uso real pelo Conselho Tutelar, com denuncia anonima, painel privado, chamados, encaminhamentos, relatorios, auditoria e controles de seguranca.

## Como Rodar Localmente

```powershell
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Verificacoes

```powershell
npm run lint
npm run build
```

## Observacoes De Dependencias

Na instalacao inicial, `npm install` reportou 2 vulnerabilidades moderadas em dependencias transitivas. Nao foi executado `npm audit fix --force`, porque esse comando pode aplicar mudancas quebraveis fora do escopo da Issue #1.
