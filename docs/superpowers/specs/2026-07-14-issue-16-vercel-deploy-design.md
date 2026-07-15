# Issue 16 - Deploy Na Vercel

## Contexto

O projeto ja possui build Next.js funcional, Supabase configurado por variaveis publicas e fluxos principais protegidos por Supabase Auth/RLS. A Issue 16 prepara a publicacao na Vercel.

## Decisoes

- O deploy sera feito importando o repositorio GitHub na Vercel.
- A branch de producao recomendada e `develop` enquanto o projeto ainda esta em evolucao academica.
- A aplicacao precisa apenas das variaveis publicas do Supabase:
  - `NEXT_PUBLIC_SUPABASE_URL`;
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- Nao sera configurada service role key no projeto Vercel.
- A documentacao deve orientar a configurar URLs do Supabase Auth apos obter a URL da Vercel.

## Fora Do Escopo

- Configurar dominio customizado.
- Executar deploy pela conta do usuario.
- Criar secrets automaticamente na Vercel.
- Alterar banco de dados remoto.

## Verificacao

- `npm run test`
- `npm run lint`
- `npm run build`
