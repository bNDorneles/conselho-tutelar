# Design - Issue 3 Supabase Config

## Objetivo

Configurar a base de integracao do Supabase no projeto sem commitar credenciais reais e sem criar schema, autenticacao administrativa ou politicas RLS nesta issue.

## Decisao De Escopo

A Issue #3 deve preparar o projeto para Supabase, mas nao depende de um projeto Supabase real para compilar.

Esta issue entrega:

- dependencias oficiais `@supabase/supabase-js` e `@supabase/ssr`;
- variaveis documentadas em `.env.local.example`;
- helpers de cliente para browser e server;
- validacao centralizada de configuracao;
- tipos iniciais de banco;
- testes automatizados para a validacao de ambiente;
- documentacao de como preencher as variaveis quando o projeto Supabase existir.

Esta issue nao entrega:

- schema do banco;
- migrations;
- projeto Supabase criado;
- login administrativo;
- RLS;
- conexao validada contra banco real.

## Arquitetura

Os helpers ficarao em `lib/supabase/`.

- `lib/supabase/config.ts`: le e valida variaveis de ambiente publicas do Supabase.
- `lib/supabase/browser.ts`: cria cliente para codigo executado no browser.
- `lib/supabase/server.ts`: cria cliente para Server Components, Server Actions e Route Handlers usando cookies do Next.
- `lib/supabase/database.types.ts`: define o tipo inicial `Database`, vazio por enquanto, para ser substituido/expandido quando a Issue #4 criar o schema.

## Variaveis De Ambiente

Usar:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Motivo: a documentacao atual do Supabase para Next.js SSR recomenda `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` junto de `NEXT_PUBLIC_SUPABASE_URL`.

Nao usar service role key no frontend, no browser ou em arquivos versionados.

## Tratamento De Erro

Se as variaveis estiverem ausentes ou invalidas, o projeto deve falhar com mensagem clara ao tentar criar cliente Supabase.

Exemplos:

- `Missing NEXT_PUBLIC_SUPABASE_URL`
- `Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `Invalid NEXT_PUBLIC_SUPABASE_URL`

## Testes

Adicionar Vitest para testar `lib/supabase/config.ts` sem depender de Next.js ou Supabase real.

Casos minimos:

- aceita URL HTTPS e publishable key preenchida;
- rejeita URL ausente;
- rejeita publishable key ausente;
- rejeita URL invalida;
- rejeita protocolo que nao seja HTTP/HTTPS.

## Criterios De Aceite

- Branch `issue/03-supabase-config` nasce de `develop`.
- Dependencias Supabase instaladas.
- `.env.local.example` criado sem segredo real.
- Helpers de browser/server criados.
- Validacao de configuracao coberta por testes.
- `npm run test` passa.
- `npm run lint` passa.
- `npm run build` passa sem exigir Supabase real.
- README, `ai.context.md` e `docs/issue-execution-log.md` atualizados.

