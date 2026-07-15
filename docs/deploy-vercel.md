# Deploy Na Vercel

Este guia prepara a publicacao do projeto Next.js na Vercel usando GitHub e Supabase.

## Pre-requisitos

- Repositorio GitHub atualizado.
- Projeto Supabase criado.
- Migrations e seed aplicados no Supabase.
- Usuario admin criado no Supabase Auth e vinculado em `public.profiles`.
- Build local passando.

```powershell
npm run test
npm run lint
npm run build
```

## Variaveis De Ambiente

Configure estas variaveis no projeto da Vercel em **Project Settings > Environment Variables**:

| Variavel | Ambiente | Observacao |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview, Development | URL do projeto Supabase. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Production, Preview, Development | Chave publica/publishable do Supabase. |

Nao configure `SUPABASE_SERVICE_ROLE_KEY` na Vercel para esta aplicacao. O sistema foi desenhado para usar Supabase Auth, RLS e a chave publica.

## Criar Projeto Na Vercel

1. Acesse a Vercel.
2. Escolha **Add New > Project**.
3. Importe o repositorio GitHub `conselho-tutelar`.
4. Confirme o framework como **Next.js**.
5. Configure:
   - Install Command: `npm install`
   - Build Command: `npm run build`
   - Output Directory: deixe padrao da Vercel para Next.js
6. Adicione as variaveis de ambiente.
7. Faça o deploy.

Enquanto o projeto ainda estiver em evolucao academica, use a branch `develop` como branch de producao. Quando a revisao final terminar, a branch `main` pode voltar a representar a versao estavel.

## Configurar Supabase Auth

Depois que a Vercel gerar a URL publica, configure no Supabase:

1. Acesse **Authentication > URL Configuration**.
2. Em **Site URL**, use a URL de producao da Vercel.
3. Em **Redirect URLs**, adicione:
   - `https://SEU-PROJETO.vercel.app/login`
   - `https://SEU-PROJETO.vercel.app/admin`
   - `https://SEU-PROJETO.vercel.app/**`

Substitua `SEU-PROJETO` pela URL real gerada pela Vercel.

## Checklist Pos-Deploy

- Abrir a home.
- Abrir `/denuncia`.
- Enviar uma denuncia de teste apenas se for aceitavel registrar dado de teste no banco.
- Abrir `/login`.
- Entrar com usuario admin.
- Validar `/admin`.
- Validar `/admin/denuncias`, `/admin/chamados`, `/admin/cadastros` e `/admin/relatorios`.
- Confirmar que rotas administrativas sem login redirecionam para `/login`.

## Observacoes

- `.env.local` e arquivos `.env*` reais nao devem ser commitados.
- Mudancas em variaveis de ambiente da Vercel exigem novo deployment para terem efeito.
- A aplicacao depende das policies RLS aplicadas no Supabase.
