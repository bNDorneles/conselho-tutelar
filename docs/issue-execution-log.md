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

## Issue #15 - Implementar relatorios basicos

Tipo da issue: fullstack/reporting
Modelo recomendado: gpt-5.5
Branch base: develop
Branch da issue: issue/15-basic-reports
Comandos de verificacao esperados:
- npm run test
- npm run lint
- npm run build

Resultado:
- `/admin/relatorios` criado.
- Filtro por periodo criado.
- Denuncias por motivo exibidas.
- Chamados por status e por conselheiro exibidos.
- Encaminhamentos por periodo exibidos.
- Medidas protetivas mais aplicadas exibidas.

## Issue #16 - Preparar deploy na Vercel

Tipo da issue: deploy/config
Modelo recomendado: gpt-5.6-sol
Branch base: develop
Branch da issue: issue/16-vercel-deploy
Comandos de verificacao esperados:
- npm run test
- npm run lint
- npm run build

Resultado:
- Guia de deploy criado em `docs/deploy-vercel.md`.
- README atualizado com resumo de deploy.
- `.env.local.example` documentado.
- Checklist de Supabase Auth, variaveis Vercel e pos-deploy criado.

## Issue #17 - Revisar home publica e linguagem institucional

Tipo da issue: frontend/content
Modelo recomendado: gpt-5.6-terra
Branch base: develop
Branch da issue: issue/17-public-home-real-product
Comandos de verificacao esperados:
- npm run test
- npm run lint
- npm run build

Resultado:
- Backlog atualizado com as novas issues de produto real.
- Spec e plano das Issues 17 a 20 criados.
- Home publica reescrita sem linguagem tecnica de MVP.
- Dados institucionais expandidos com WhatsApp, Facebook, Instagram e mapa.
- Helper publico criado para normalizar dados do Conselho Tutelar.
- Testes adicionados para copy publica e dados institucionais.

## Issue #18 - Expandir formulario publico de denuncia

Tipo da issue: fullstack/security
Modelo recomendado: gpt-5.5
Branch base: develop
Branch da issue: issue/18-rich-denuncia-form
Comandos de verificacao esperados:
- npm run test
- npm run lint
- npm run build

Resultado:
- Formulario publico expandido com dados de vitima, familia, escola, genero e localizacao.
- Validacao Zod atualizada para campos opcionais e genero informado.
- Payload puro criado para gravacao da denuncia.
- Migration adicionada para novos campos de denuncia.
- Tipos Supabase atualizados.
- Testes adicionados para validacao e payload do formulario.

## Issue #19 - Completar catalogos do TCC antigo

Tipo da issue: database/admin
Modelo recomendado: gpt-5.6-sol
Branch base: develop
Branch da issue: issue/19-catalogos-tcc-antigo
Comandos de verificacao esperados:
- npm run test
- npm run lint
- npm run build

Resultado:
- Motivos de denuncia do TCC antigo normalizados no seed.
- Medidas protetivas do TCC antigo normalizadas no seed.
- Migration idempotente criada para atualizar bancos existentes.
- Upserts passaram a usar `on conflict (nome) do update`.
- Testes estaticos adicionados para proteger catalogos obrigatorios e evitar duplicacoes.

## Issue #20 - Criar layout administrativo com sidebar

Tipo da issue: frontend/admin-ui
Modelo recomendado: gpt-5.6-terra
Branch base: develop
Branch da issue: issue/20-admin-sidebar-layout
Comandos de verificacao esperados:
- npm run test
- npm run lint
- npm run build

Resultado:
- Layout compartilhado criado para rotas `/admin`.
- Sidebar administrativa criada com perfil, navegacao e logout.
- Links da sidebar ajustados por perfil: conselheiro ve fluxo diario, admin ve manutencoes.
- Topos administrativos duplicados removidos das paginas principais.
- Anchors de cadastros adicionadas para Conselheiros, Motivos, Medidas e Conselho.
- Teste de navegacao administrativa adicionado.

## Issue #21 - Gestao de conselheiros pelo superadmin

Tipo da issue: fullstack/admin/security
Modelo recomendado: gpt-5.5
Branch base: develop
Branch da issue: issue/21-conselheiros-management
Comandos de verificacao esperados:
- npm run test
- npm run lint
- npm run build

Resultado:
- `profiles` expandida com email, telefone, cargo, foto, sobre, mandato e exibicao publica.
- Cadastro de conselheiro adicionado em `/admin/cadastros`.
- Conselheiros sao vinculados a usuarios ja existentes no Supabase Auth pelo UID.
- Leitura publica permitida apenas para conselheiros ativos marcados como publicos.
- Home publica exibe equipe do Conselho quando houver conselheiros publicos.

## Issue #22 - Ajustar fluxo real da denuncia

Tipo da issue: fullstack/business
Modelo recomendado: gpt-5.5
Branch base: develop
Branch da issue: issue/22-denuncia-workflow
Comandos de verificacao esperados:
- npm run test
- npm run lint
- npm run build

Resultado:
- Status `atribuida` adicionado ao fluxo de denuncias.
- Denuncia agora pode ter `conselheiro_responsavel_id`.
- Tela de detalhe permite atribuir denuncia a conselheiro.
- Kanban/listagem mostra responsavel e permite filtro por conselheiro.
- Criacao de chamado passa a exigir denuncia em analise.
- Dados complementares da vitima sao carregados para a criacao do atendimento.

## Issue #23 - Implementar Kanban com arrastar e soltar

Tipo da issue: frontend/fullstack
Modelo recomendado: gpt-5.5
Branch base: develop
Branch da issue: issue/23-dnd-kanban-denuncias
Comandos de verificacao esperados:
- npm run test
- npm run lint
- npm run build

Resultado:
- `@dnd-kit/core` adicionado ao projeto.
- Kanban de denuncias extraido para componente client.
- Cards podem ser arrastados entre colunas permitidas.
- Mudanca por drag-and-drop chama Server Action, registra auditoria e revalida a tela.
- Botoes antigos de movimentacao continuam disponiveis como alternativa.

## Issue #24 - Evoluir chamados, medidas e encaminhamentos

Tipo da issue: fullstack/business
Modelo recomendado: gpt-5.5
Branch base: develop
Branch da issue: issue/24-chamado-medidas-encaminhamentos
Comandos de verificacao esperados:
- npm run test
- npm run lint
- npm run build

Resultado:
- Tabela `chamado_medidas_protetivas` criada para separar medidas aplicadas de encaminhamentos.
- RLS adicionada para leitura/gestao por conselheiros ativos.
- Helpers e action criados para aplicar medida protetiva no chamado.
- Detalhe do chamado ganhou formulario de aplicacao de medida e lista de medidas aplicadas.
- Encaminhamentos continuam registrando relato, destino e historico do que foi feito.

## Issue #26 - Fluxo visual completo do atendimento

Tipo da issue: fullstack/business
Modelo recomendado: gpt-5.5
Branch base: develop
Branch da issue: issue/26-fluxo-operacional-completo
Comandos de verificacao executados:
- npm.cmd test
- npm.cmd run lint
- npm.cmd run build

Resultado:
- Helper puro criado para derivar etapa operacional de denuncia/chamado.
- Kanban de denuncias passou a exibir o fluxo completo: recebida, atribuida, em analise, chamado aberto, medida protetiva, encaminhamento, finalizado e arquivada.
- Query administrativa de denuncias agora carrega chamado vinculado, medidas aplicadas e encaminhamentos para atualizar a etapa automaticamente.
- Cards convertidos em chamado aparecem na etapa operacional correta sem voltar para analise.
- Detalhe do chamado passou a mostrar etapa operacional da denuncia vinculada, evitando exibir `em_analise` quando o atendimento ja foi finalizado.
- Testes adicionados para fluxo operacional, agrupamento derivado e exibicao de chamado finalizado.

## Issue #27 - Acessibilidade visual e identidade das telas

Tipo da issue: frontend/ux
Modelo recomendado: gpt-5.6-sol
Branch base: develop
Branch da issue: issue/27-identidade-visual-fluxos
Comandos de verificacao executados:
- npm.cmd run test -- lib/admin/visual-status.test.ts lib/admin/operational-flow.test.ts
- npm.cmd run lint
- npm.cmd run build

Resultado:
- Helper visual criado para acentos de area e tons semanticos de status.
- Kanban recebeu descricoes por etapa, contadores coloridos e badges por etapa operacional.
- Telas de detalhe de denuncia e chamado receberam trilha visual do fluxo de atendimento.
- Cabecalhos de Denuncias, Chamados, Cadastros e Relatorios passaram a ter acentos visuais distintos.
- Testes adicionados para proteger mapeamento de areas, tons e classes de status.

## Issue #28 - Cadastros auxiliares editaveis e compactos

Tipo da issue: fullstack/admin-ui
Modelo recomendado: gpt-5.5
Branch base: develop
Branch da issue: issue/28-cadastros-editaveis-compactos
Comandos de verificacao executados:
- npm.cmd run test -- lib/admin/cadastros.test.ts
- npm.cmd run lint
- npm.cmd run build

Resultado:
- Motivos de denuncia e medidas protetivas ganharam edicao inline de nome e descricao.
- Listas longas foram compactadas em secoes recolhiveis com contadores de ativos e inativos.
- Acoes de ativar/desativar foram mantidas.
- Action compartilhada criada para atualizar catalogos com auditoria.
- Teste adicionado para payload de edicao de catalogo.

## Issue #29 - Cadastro de conselheiros completo

Tipo da issue: fullstack/admin/storage
Modelo recomendado: gpt-5.5
Branch base: develop
Branch da issue: issue/29-conselheiros-foto-telefones
Comandos de verificacao executados:
- npm.cmd test
- npm.cmd run lint
- npm.cmd run build

Resultado:
- `profiles` ganhou campos `telefone_fixo` e `telefone_plantao`.
- Migration criada para bucket publico `conselheiros` no Supabase Storage e policies de leitura/gestao.
- Cadastro de conselheiro aceita upload local PNG/JPG e URL alternativa.
- Mandato passa a vir com padrao `2024-2028`.
- Telefone fixo e plantao/WhatsApp foram separados na area administrativa e publica.
- Home publica exibe foto real do conselheiro quando `foto_url` estiver disponivel.
- Configuracao de imagens remotas do Next permite imagens do Supabase.

## Issue #30 - Relatorios gerenciais avancados

Tipo da issue: frontend/data-viz
Modelo recomendado: gpt-5.6-sol
Branch base: develop
Branch da issue: issue/30-relatorios-graficos-comparacao
Comandos de verificacao executados:
- npm.cmd run test -- lib/admin/relatorios.test.ts
- npm.cmd run lint
- npm.cmd run build

Resultado:
- Relatorios ganharam selecao de categorias por checkbox.
- Graficos de barras foram mantidos para rankings.
- Graficos donut em CSS foram adicionados para distribuicoes.
- Comparacao entre blocos pode ser feita selecionando duas ou mais categorias.
- Teste adicionado para parsing de categorias selecionadas e fallback padrao.

## Issue #31 - Exportacao PDF de relatorios

Tipo da issue: frontend/admin-export
Modelo recomendado: gpt-5.5
Branch base: develop
Branch da issue: issue/31-exportacao-pdf-relatorios
Comandos de verificacao executados:
- npm.cmd run test -- lib/admin/relatorios.test.ts
- npm.cmd test
- npm.cmd run lint
- npm.cmd run build

Resultado:
- Relatorios ganharam link de exportacao preservando periodo e categorias selecionadas.
- Rota `/admin/relatorios/exportar` criada com layout proprio para impressao.
- Tela de exportacao mostra totais, blocos selecionados e barras legiveis para salvar em PDF.
- Botao `Gerar PDF` aciona a impressao do navegador em uma pagina limpa.
- Teste adicionado para montagem segura da query de exportacao.

## Issue #32 - Polimento final de fluxos e relatorios

Tipo da issue: frontend/quality
Modelo recomendado: gpt-5.6-sol
Branch base: develop
Branch da issue: issue/32-polimento-final-fluxos-relatorios
Comandos de verificacao executados:
- npm.cmd test
- npm.cmd run lint
- npm.cmd run build

Resultado:
- Cadastros de motivos e medidas passaram a exibir textos longos sem corte.
- Edicao de catalogos ficou recolhivel, com campos amplos e textarea para descricao.
- Kanban passou a funcionar como esteira horizontal com colunas mais largas.
- Drag-and-drop agora respeita a diferenca entre etapa operacional e status real da denuncia.
- Exportacao de relatorios ganhou formato documental, com resumo executivo, tabelas e barras compactas.
- Sidebar administrativa foi escondida na impressao para nao sair no PDF.
- CSS de impressao global ajustado para A4, margens e visual limpo.
- Rotulos tecnicos dos relatorios foram convertidos para texto final amigavel.
