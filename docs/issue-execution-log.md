# Issue Execution Log

## Issue #1 - Inicializar projeto Next.js com TypeScript

Tipo da issue: fundacao/frontend
Modelo recomendado: gpt-5.6-terra
Branch base: develop
Branch da issue: issue/01-nextjs-base
Arquivos/documentos lidos:
- ai.context.md
- docs/github-issues.md
- docs/superpowers/specs/2026-07-14-fluxo-branches-modelos-design.md
- docs/superpowers/plans/2026-07-14-issues-01-02-base-next-ui.md
Comandos de verificacao esperados:
- npm run lint
- npm run build
- npm run dev

Resultado:
- `npm install` executado com sucesso.
- `npm run lint` passou.
- `npm run build` passou.
- `npm install` reportou 2 vulnerabilidades moderadas em dependencias transitivas; nao foi usado `npm audit fix --force` para evitar mudanca quebravel fora do escopo.

## Issue #2 - Configurar shadcn/ui e identidade visual base

Tipo da issue: frontend/ui
Modelo recomendado: gpt-5.6-terra
Branch base: develop
Branch da issue: issue/02-ui-base
Arquivos/documentos lidos:
- ai.context.md
- docs/github-issues.md
- docs/decisao-arquitetura.md
- docs/superpowers/specs/2026-07-14-modernizacao-tcc-conselho-tutelar-design.md
- docs/superpowers/specs/2026-07-14-fluxo-branches-modelos-design.md
- docs/superpowers/plans/2026-07-14-issues-01-02-base-next-ui.md
Comandos de verificacao esperados:
- npm run lint
- npm run build
- npm run dev

Resultado:
- `npx shadcn@latest init --defaults --template next --yes` executado com sucesso.
- Componentes adicionados: button, card, badge, input, label, textarea, select, separator.
- `/` recebeu base publica institucional.
- `/admin` recebeu base visual administrativa sem auth, dados reais ou Supabase.
- `npm run lint` passou.
- `npm run build` passou.
- Verificacao HTTP passou para `/` e `/admin`.
- Verificacao visual headless com Microsoft Edge passou em desktop e mobile, sem overflow horizontal.

## Issue #3 - Configurar Supabase no projeto

Tipo da issue: backend/integracao
Modelo recomendado: gpt-5.6-sol
Branch base: develop
Branch da issue: issue/03-supabase-config
Arquivos/documentos lidos:
- ai.context.md
- docs/github-issues.md
- docs/decisao-arquitetura.md
- docs/seguranca-lgpd.md
- docs/superpowers/specs/2026-07-14-supabase-config-design.md
- docs/superpowers/plans/2026-07-14-issue-03-supabase-config.md
Comandos de verificacao esperados:
- npm run test
- npm run lint
- npm run build

Resultado:
- Dependencias instaladas: `@supabase/supabase-js`, `@supabase/ssr` e `vitest`.
- `.env.local.example` criado sem credenciais reais.
- Helpers criados em `lib/supabase/`.
- Validacao de configuracao coberta por testes.
- Build nao exige projeto Supabase real.
- `npm install` manteve 2 vulnerabilidades moderadas em dependencias transitivas; nao foi usado `npm audit fix --force` para evitar mudanca quebravel fora do escopo.

## Issue #4 - Criar schema inicial do banco no Supabase

Tipo da issue: database/security
Modelo recomendado: gpt-5.6-sol
Branch base: develop
Branch da issue: issue/04-initial-supabase-schema
Arquivos/documentos lidos:
- ai.context.md
- docs/github-issues.md
- docs/decisao-arquitetura.md
- docs/seguranca-lgpd.md
- docs/superpowers/specs/2026-07-14-schema-inicial-supabase-design.md
- docs/superpowers/plans/2026-07-14-issue-04-initial-supabase-schema.md
Comandos de verificacao esperados:
- npm run test
- npm run lint
- npm run build

Resultado:
- Migration criada em `supabase/migrations/20260714000100_create_initial_schema.sql`.
- Seed criado em `supabase/seed.sql`.
- Tabelas criadas no SQL: profiles, conselho_tutelar, motivos_denuncia, denuncias, vitimas, chamados, medidas_protetivas, encaminhamentos e audit_logs.
- Enums criados no SQL: profile_role, denuncia_status, chamado_status e audit_action.
- RLS e policies ficaram fora desta issue, conforme planejado para a Issue #6.
- Tipos iniciais atualizados em `lib/supabase/database.types.ts`.
- Teste estatico do schema criado em `supabase/schema.test.ts`.
- `supabase db reset` nao foi executado porque Supabase CLI nao esta instalado neste ambiente.

## Issue #5 - Configurar autenticacao administrativa

Tipo da issue: auth/security
Modelo recomendado: gpt-5.6-sol
Branch base: develop
Branch da issue: issue/05-admin-auth
Arquivos/documentos lidos:
- ai.context.md
- docs/github-issues.md
- docs/seguranca-lgpd.md
- docs/superpowers/specs/2026-07-14-auth-rls-design.md
- docs/superpowers/plans/2026-07-14-issues-05-06-auth-rls.md
Comandos de verificacao esperados:
- npm run test
- npm run lint
- npm run build

Resultado:
- `/login` criado.
- Server Actions de login e logout criadas.
- `/admin` protegido por profile ativo.
- Proxy de sessao Supabase criado para rotas administrativas.
- Usuarios reais e service role ficaram fora desta issue.

## Issue #6 - Configurar RLS e politicas de acesso

Tipo da issue: security/database
Modelo recomendado: gpt-5.6-sol
Branch base: develop
Branch da issue: issue/06-rls-policies
Arquivos/documentos lidos:
- ai.context.md
- docs/github-issues.md
- docs/seguranca-lgpd.md
- docs/superpowers/specs/2026-07-14-auth-rls-design.md
- docs/superpowers/plans/2026-07-14-issues-05-06-auth-rls.md
Comandos de verificacao esperados:
- npm run test
- npm run lint
- npm run build

Resultado:
- Migration de RLS criada em `supabase/migrations/20260714000200_enable_rls_policies.sql`.
- RLS habilitado nas tabelas publicas do sistema.
- Insert anonimo em `denuncias` permitido apenas para denuncia recebida e sem observacoes internas.
- Leitura publica de `denuncias`, `vitimas`, `chamados`, `encaminhamentos` e `audit_logs` nao foi criada.
- Leitura administrativa depende de profile ativo via `public.is_active_conselheiro()`.
- Manutencao de catalogos e dados institucionais depende de `public.is_active_admin()`.
- Teste estatico criado em `supabase/rls.test.ts`.

## Issue #8 - Criar formulario de denuncia anonima

Tipo da issue: fullstack/security
Modelo recomendado: gpt-5.5
Branch base: develop
Branch da issue: issue/08-anonymous-complaint-form
Arquivos/documentos lidos:
- ai.context.md
- docs/github-issues.md
- docs/seguranca-lgpd.md
- docs/superpowers/specs/2026-07-14-denuncia-dashboard-design.md
- docs/superpowers/plans/2026-07-14-issues-08-09-denuncia-dashboard.md
Comandos de verificacao esperados:
- npm run test
- npm run lint
- npm run build

Resultado:
- `/denuncia` criado.
- `/denuncia/enviada` criado.
- Validacao Zod criada em `lib/denuncias/validation.ts`.
- Server Action de envio criada em `lib/denuncias/actions.ts`.
- Home atualizada com CTA para denuncia anonima.

## Issue #9 - Criar dashboard administrativo

Tipo da issue: fullstack/ui
Modelo recomendado: gpt-5.5
Branch base: develop
Branch da issue: issue/09-admin-dashboard
Arquivos/documentos lidos:
- ai.context.md
- docs/github-issues.md
- docs/seguranca-lgpd.md
- docs/superpowers/specs/2026-07-14-denuncia-dashboard-design.md
- docs/superpowers/plans/2026-07-14-issues-08-09-denuncia-dashboard.md
Comandos de verificacao esperados:
- npm run test
- npm run lint
- npm run build

Resultado:
- `/admin` atualizado para usar dados reais do Supabase.
- Indicadores de denuncias totais e chamados por status criados.
- Listas de denuncias recentes e chamados recentes criadas.
- Helpers e testes adicionados em `lib/admin/dashboard.ts`.

## Issue #10 - Implementar listagem e detalhe de denuncias

Tipo da issue: fullstack/security
Modelo recomendado: gpt-5.5
Branch base: develop
Branch da issue: issue/10-denuncias-kanban-detail
Arquivos/documentos lidos:
- ai.context.md
- docs/github-issues.md
- docs/seguranca-lgpd.md
- docs/superpowers/specs/2026-07-14-issue-10-denuncias-kanban-detail-design.md
- docs/superpowers/plans/2026-07-14-issue-10-denuncias-kanban-detail.md
Comandos de verificacao esperados:
- npm run test
- npm run lint
- npm run build

Resultado:
- `/admin/denuncias` criado com visao Kanban por status.
- Filtros por status, motivo e periodo criados.
- Mudanca de status permitida para movimentos de triagem da Issue #10.
- `/admin/denuncias/[id]` criado para detalhe protegido da denuncia.
- Auditoria de leitura e mudanca de status registrada em `audit_logs`.

## Issue #11 - Criar chamado a partir de denuncia

Tipo da issue: fullstack/business
Modelo recomendado: gpt-5.5
Branch base: develop
Branch da issue: issue/11-create-chamado-from-denuncia
Arquivos/documentos lidos:
- ai.context.md
- docs/github-issues.md
- docs/superpowers/specs/2026-07-14-issue-11-create-chamado-design.md
- docs/superpowers/plans/2026-07-14-issue-11-create-chamado.md
Comandos de verificacao esperados:
- npm run test
- npm run lint
- npm run build

Resultado:
- Botao de criacao de chamado adicionado em `/admin/denuncias/[id]`.
- Criacao de `vitimas` opcional quando a denuncia possui dados da vitima.
- Criacao de `chamados` com status inicial `aberto`.
- Denuncia marcada como `convertida_em_chamado`.
- Auditoria criada para chamado e mudanca de status da denuncia.

## Issue #12 - Implementar tela de chamados

Tipo da issue: fullstack/ui
Modelo recomendado: gpt-5.5
Branch base: develop
Branch da issue: issue/12-chamados-list-detail
Arquivos/documentos lidos:
- ai.context.md
- docs/github-issues.md
- docs/superpowers/specs/2026-07-14-issue-12-chamados-list-detail-design.md
- docs/superpowers/plans/2026-07-14-issue-12-chamados-list-detail.md
Comandos de verificacao esperados:
- npm run test
- npm run lint
- npm run build

Resultado:
- `/admin/chamados` criado com filtros por status, conselheiro e periodo.
- `/admin/chamados/[id]` criado com detalhe do chamado.
- Status de chamados alteravel com validacao de transicoes.
- `data_fechamento` preenchida ao finalizar e limpa ao reabrir atendimento.
- Auditoria criada para leitura e mudanca de status de chamados.

## Issue #13 - Implementar encaminhamentos e medidas protetivas

Tipo da issue: fullstack/business
Modelo recomendado: gpt-5.5
Branch base: develop
Branch da issue: issue/13-encaminhamentos
Comandos de verificacao esperados:
- npm run test
- npm run lint
- npm run build

Resultado:
- Formulario de encaminhamento criado em `/admin/chamados/[id]`.
- Historico de encaminhamentos exibido no detalhe do chamado.
- Medida protetiva opcional integrada ao encaminhamento.
- Auditoria criada ao registrar encaminhamento.

## Issue #14 - Implementar cadastros auxiliares

Tipo da issue: fullstack/admin
Modelo recomendado: gpt-5.5
Branch base: develop
Branch da issue: issue/14-admin-maintenance
Comandos de verificacao esperados:
- npm run test
- npm run lint
- npm run build

Resultado:
- `/admin/cadastros` criado com acesso restrito a admin ativo.
- Criacao e ativacao/desativacao de motivos de denuncia.
- Criacao e ativacao/desativacao de medidas protetivas.
- Edicao de dados institucionais do Conselho Tutelar.
- Listagem e ativacao/desativacao de perfis existentes.
