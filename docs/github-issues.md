# Backlog Inicial Para GitHub Issues

Este arquivo define as tarefas pequenas do projeto. A ideia e transformar cada item em uma GitHub Issue para trabalharmos por etapas, evitando implementar tudo em uma unica conversa.

## Pre-Requisito Obrigatorio Para Todas As Issues

Antes de implementar qualquer issue, registrar:

```text
Tipo da issue:
Modelo recomendado:
Branch base:
Branch da issue:
Arquivos/documentos lidos:
Comandos de verificacao esperados:
```

Padrao de branches:

- `main`: branch estavel/publicavel.
- `develop`: branch de integracao.
- `issue/<numero>-<slug>`: branch de uma unica issue, criada a partir de `develop`.

Politica de modelos:

- `gpt-5.6-sol`: banco, Supabase, RLS, auth, backend critico, auditoria, LGPD e arquitetura.
- `gpt-5.5`: tarefas fullstack, regras de negocio, debugging pesado e integracoes.
- `gpt-5.6-terra`: frontend, shadcn/ui, layouts, dashboards visuais e documentacao tecnica media.
- `gpt-5.6-luna`: ajustes pequenos, texto, limpeza e tarefas mecanicas de baixo risco.

## Milestone 1 - Fundacao Do Projeto

### Issue 1 - Inicializar projeto Next.js com TypeScript

**Tipo:** fundacao/frontend

**Modelo recomendado:** `gpt-5.6-terra`

**Objetivo:** Criar a base da aplicacao moderna.

**Escopo:**

- Criar projeto Next.js na raiz do repositorio.
- Configurar TypeScript.
- Configurar ESLint.
- Configurar Tailwind CSS.
- Configurar estrutura inicial de pastas.
- Garantir que `npm run dev` funcione.

**Criterios de aceite:**

- Aplicacao abre localmente.
- Pagina inicial temporaria renderiza.
- TypeScript e lint rodam sem erro inicial.

### Issue 2 - Configurar shadcn/ui e identidade visual base

**Tipo:** frontend/ui

**Modelo recomendado:** `gpt-5.6-terra`

**Objetivo:** Preparar uma interface moderna, institucional e consistente.

**Escopo:**

- Instalar/configurar shadcn/ui.
- Definir tokens visuais iniciais.
- Criar layout base publico.
- Criar layout base administrativo.

**Criterios de aceite:**

- Componentes base funcionam.
- Layout nao parece template Bootstrap.
- Interface tem visual serio, limpo e acolhedor.

### Issue 3 - Configurar Supabase no projeto

**Tipo:** backend/integracao

**Modelo recomendado:** `gpt-5.6-sol`

**Objetivo:** Conectar a aplicacao ao Supabase.

**Escopo:**

- Criar helpers de cliente Supabase para browser/server.
- Definir variaveis de ambiente.
- Documentar `.env.local.example`.
- Validar conexao local.

**Criterios de aceite:**

- Projeto consegue inicializar cliente Supabase.
- Variaveis necessarias estao documentadas.

## Milestone 2 - Banco, Auth E Seguranca

### Issue 4 - Criar schema inicial do banco no Supabase

**Tipo:** database/security

**Modelo recomendado:** `gpt-5.6-sol`

**Objetivo:** Criar modelo relacional inicial.

**Escopo:**

- Criar migrations para `profiles`, `denuncias`, `vitimas`, `motivos_denuncia`, `chamados`, `medidas_protetivas`, `encaminhamentos`, `audit_logs` e `conselho_tutelar`.
- Criar enums de status.
- Criar indices basicos.
- Criar seeds iniciais para motivos e medidas.

**Criterios de aceite:**

- Migrations rodam sem erro.
- Tabelas refletem o fluxo denuncia -> chamado -> encaminhamento.

### Issue 5 - Configurar autenticação administrativa

**Tipo:** auth/security

**Modelo recomendado:** `gpt-5.6-sol`

**Objetivo:** Permitir login seguro de conselheiros/admins.

**Escopo:**

- Integrar Supabase Auth.
- Criar tela de login.
- Criar protecao de rotas administrativas.
- Criar perfil `conselheiro` e `admin`.

**Criterios de aceite:**

- Usuario nao autenticado nao acessa painel.
- Usuario autenticado acessa dashboard.
- Logout funciona.

### Issue 6 - Configurar RLS e politicas de acesso

**Tipo:** security/database

**Modelo recomendado:** `gpt-5.6-sol`

**Objetivo:** Proteger dados sensiveis.

**Escopo:**

- Ativar RLS em tabelas sensiveis.
- Permitir insert publico controlado em `denuncias`.
- Bloquear leitura publica de denuncias.
- Permitir leitura administrativa para perfis autorizados.

**Criterios de aceite:**

- Area publica nao consegue ler denuncias.
- Conselheiro autenticado consegue ler denuncias.
- Politicas estao versionadas/documentadas.

## Milestone 3 - Area Publica

### Issue 7 - Criar site publico institucional

**Tipo:** frontend/content

**Modelo recomendado:** `gpt-5.6-terra`

**Objetivo:** Criar primeira experiencia publica do sistema.

**Escopo:**

- Pagina inicial.
- Secao sobre Conselho Tutelar.
- Secao quando denunciar.
- Contatos e localizacao.
- CTA para denuncia anonima.

**Criterios de aceite:**

- Pagina responsiva.
- Texto claro e acolhedor.
- Sem placeholders visiveis.

### Issue 8 - Criar formulario de denuncia anonima

**Tipo:** fullstack/security

**Modelo recomendado:** `gpt-5.5`

**Objetivo:** Permitir envio seguro de denuncia anonima.

**Escopo:**

- Criar formulario com motivo, relato e dados opcionais da vitima.
- Validar dados com Zod.
- Salvar denuncia no Supabase.
- Exibir confirmacao de envio.

**Criterios de aceite:**

- Denuncia e gravada no banco.
- Campos obrigatorios sao validados.
- Usuario nao recebe acesso a dados internos.

## Milestone 4 - Painel Administrativo

### Issue 9 - Criar dashboard administrativo inicial

**Tipo:** fullstack/ui

**Modelo recomendado:** `gpt-5.5`

**Objetivo:** Dar visao geral para conselheiros.

**Escopo:**

- Cards com total de denuncias, chamados abertos, em atendimento e finalizados.
- Lista de denuncias recentes.
- Lista de chamados recentes.

**Criterios de aceite:**

- Dashboard usa dados reais.
- Tela exige login.

### Issue 10 - Implementar listagem e detalhe de denuncias

**Tipo:** fullstack/security

**Modelo recomendado:** `gpt-5.5`

**Objetivo:** Permitir triagem administrativa.

**Escopo:**

- Listar denuncias recebidas.
- Filtrar por status/motivo/data.
- Abrir detalhe da denuncia.
- Registrar leitura em auditoria.

**Criterios de aceite:**

- Conselheiro consegue analisar denuncia.
- Acesso gera log de auditoria.

### Issue 11 - Criar chamado a partir de denuncia

**Tipo:** fullstack/business

**Modelo recomendado:** `gpt-5.5`

**Objetivo:** Formalizar atendimento a partir da denuncia.

**Escopo:**

- Botao "Criar chamado" no detalhe da denuncia.
- Associar conselheiro responsavel.
- Associar/criar vitima quando necessario.
- Definir status inicial.
- Marcar denuncia como convertida.

**Criterios de aceite:**

- Chamado e criado corretamente.
- Denuncia fica vinculada ao chamado.
- Acao gera log de auditoria.

## Milestone 5 - Gestão Do Atendimento

### Issue 12 - Implementar tela de chamados

**Tipo:** fullstack/ui

**Modelo recomendado:** `gpt-5.5`

**Objetivo:** Acompanhar casos em andamento.

**Escopo:**

- Listar chamados.
- Filtrar por status, conselheiro e periodo.
- Abrir detalhe do chamado.
- Alterar status.

**Criterios de aceite:**

- Conselheiro acompanha chamados.
- Status muda com validacao.

### Issue 13 - Implementar encaminhamentos e medidas protetivas

**Tipo:** fullstack/business

**Modelo recomendado:** `gpt-5.5`

**Objetivo:** Registrar acoes tomadas em cada chamado.

**Escopo:**

- Adicionar encaminhamento ao chamado.
- Selecionar medida protetiva.
- Registrar data e observacoes.
- Exibir historico do chamado.

**Criterios de aceite:**

- Chamado mostra timeline/historico.
- Encaminhamentos sao persistidos.
- Acoes geram auditoria.

### Issue 14 - Implementar cadastros auxiliares

**Tipo:** fullstack/admin

**Modelo recomendado:** `gpt-5.5`

**Objetivo:** Permitir manutencao dos dados de apoio.

**Escopo:**

- CRUD de motivos.
- CRUD de medidas protetivas.
- CRUD de conselheiros/perfis.
- Edicao de dados institucionais do Conselho Tutelar.

**Criterios de aceite:**

- Apenas admin acessa manutencoes sensiveis.
- Cadastros aparecem nos formularios correspondentes.

## Milestone 6 - Relatorios E Deploy Inicial

### Issue 15 - Implementar relatorios basicos

**Tipo:** fullstack/reporting

**Modelo recomendado:** `gpt-5.5`

**Objetivo:** Dar visao gerencial do atendimento.

**Escopo:**

- Denuncias por motivo.
- Chamados por status.
- Chamados por conselheiro.
- Encaminhamentos por periodo.
- Medidas protetivas mais aplicadas.

**Criterios de aceite:**

- Relatorios usam dados reais.
- Filtros por periodo funcionam.

### Issue 16 - Preparar deploy na Vercel

**Tipo:** deploy/config

**Modelo recomendado:** `gpt-5.6-sol`

**Objetivo:** Colocar aplicacao no ar.

**Escopo:**

- Configurar variaveis de ambiente.
- Garantir build de producao.
- Configurar projeto na Vercel.
- Documentar deploy.

**Criterios de aceite:**

- Aplicacao publicada.
- Build passa.
- README explica como configurar.

## Milestone 7 - Produto Real E Fluxo Do Conselho

### Issue 17 - Revisar home publica e linguagem institucional

**Tipo:** frontend/content

**Modelo recomendado:** `gpt-5.6-terra`

**Objetivo:** Transformar a area publica em uma interface de produto real, acolhedora e institucional.

**Escopo:**

- Remover textos tecnicos e mensagens de MVP da home.
- Exibir dados do Conselho Tutelar: localizacao, telefone, e-mail, WhatsApp, Facebook e Instagram.
- Criar secoes publicas uteis: quando procurar o Conselho, canais de atendimento, equipe e denuncia anonima.
- Manter tom acolhedor, seguro e nao tecnico.
- Usar dados reais ou editaveis vindos da tabela `conselho_tutelar` quando disponiveis.

**Criterios de aceite:**

- Home nao menciona Supabase, RLS, MVP ou implementacao interna.
- Contatos institucionais aparecem de forma clara.
- Area publica parece uma entrega real para cidadaos.

### Issue 18 - Expandir formulario publico de denuncia

**Tipo:** fullstack/security

**Modelo recomendado:** `gpt-5.5`

**Objetivo:** Coletar informacoes suficientes para triagem real sem perder o carater anonimo da denuncia.

**Escopo:**

- Adicionar campos inspirados no TCC antigo: nome da vitima, nome do pai, nome da mae, endereco, escola, idade e genero.
- Manter motivo da denuncia, local da ocorrencia e relato detalhado.
- Ajustar migration, tipos Supabase, validacao Zod e Server Action.
- Melhorar textos do formulario para orientar o denunciante.
- Preservar bloqueio de leitura publica e insert anonimo controlado.

**Criterios de aceite:**

- Denuncia salva todos os campos necessarios para analise inicial.
- Campos obrigatorios e opcionais sao validados.
- Formulario continua anonimo e sem consulta publica posterior.

### Issue 19 - Completar catalogos do TCC antigo

**Tipo:** database/admin

**Modelo recomendado:** `gpt-5.6-sol`

**Objetivo:** Trazer motivos de denuncia e medidas protetivas do TCC antigo para o novo sistema.

**Escopo:**

- Revisar motivos de denuncia do SQL antigo.
- Revisar medidas protetivas do SQL antigo.
- Normalizar nomes, remover duplicados e corrigir quebras de texto.
- Atualizar seeds/migrations.
- Garantir que catalogos aparecam nos formularios e telas administrativas.

**Criterios de aceite:**

- Motivos e medidas cobrem os dados do TCC antigo.
- Itens duplicados ou quebrados nao aparecem na interface.
- Seeds podem ser reaplicados sem criar duplicacao.

### Issue 20 - Criar layout administrativo com sidebar

**Tipo:** frontend/admin-ui

**Modelo recomendado:** `gpt-5.6-terra`

**Objetivo:** Melhorar a navegacao administrativa com uma sidebar inspirada no projeto antigo.

**Escopo:**

- Criar layout compartilhado para rotas `/admin`.
- Adicionar sidebar com links para Dashboard, Denuncias, Chamados, Conselheiros, Motivos, Medidas, Conselho, Relatorios e Sair.
- Destacar rota ativa.
- Manter layout responsivo.
- Reaproveitar componentes e tokens visuais atuais.

**Criterios de aceite:**

- Todas as telas administrativas principais usam a sidebar.
- Conselheiro/admin navega sem depender de links soltos em cada tela.
- Logout e retorno para area publica ficam acessiveis.

## Milestone 8 - Fluxo Operacional E Fechamento

### Issue 21 - Gestao de conselheiros pelo superadmin

**Tipo:** fullstack/admin/security

**Modelo recomendado:** `gpt-5.5`

**Objetivo:** Permitir que o superadmin gerencie conselheiros e a exibicao publica da equipe.

**Escopo:**

- Criar/editar perfis de conselheiros.
- Campos: nome, e-mail, telefone, foto, sobre, mandato/cargo, ativo e exibir na area publica.
- Integrar com Supabase Auth de forma segura.
- Exibir conselheiros ativos na area publica.

**Criterios de aceite:**

- Admin consegue manter conselheiros.
- Conselheiros ativos aparecem na area publica quando marcados para exibicao.
- Usuarios sem permissao nao acessam o cadastro.

### Issue 22 - Ajustar fluxo real da denuncia

**Tipo:** fullstack/business

**Modelo recomendado:** `gpt-5.5`

**Objetivo:** Representar o fluxo denuncia -> atribuicao -> analise -> chamado.

**Escopo:**

- Adicionar atribuicao de denuncia a conselheiro.
- Ajustar status da denuncia para refletir recebida, atribuida, em analise, convertida ou arquivada.
- Registrar auditoria de atribuicao e mudanca de status.
- Permitir decisao de procedencia antes de criar chamado.

**Criterios de aceite:**

- Denuncia pode ser atribuida a um conselheiro.
- Conselheiro acompanha sua fila de analise.
- Criacao de chamado respeita o fluxo de triagem.

### Issue 23 - Implementar Kanban com arrastar e soltar

**Tipo:** frontend/fullstack

**Modelo recomendado:** `gpt-5.5`

**Objetivo:** Permitir movimentar denuncias entre etapas do Kanban por drag and drop.

**Escopo:**

- Usar biblioteca solida para drag and drop, preferencialmente `@dnd-kit`.
- Atualizar status ao soltar card em outra coluna.
- Manter botoes alternativos para acessibilidade.
- Registrar auditoria da movimentacao.

**Criterios de aceite:**

- Card pode ser arrastado entre colunas.
- Mudanca persiste no Supabase.
- Interface continua funcional por teclado/botoes.

### Issue 24 - Evoluir chamados, medidas e encaminhamentos

**Tipo:** fullstack/business

**Modelo recomendado:** `gpt-5.5`

**Objetivo:** Completar o acompanhamento do chamado com medidas protetivas e relato do conselheiro.

**Escopo:**

- Permitir revisar dados vindos da denuncia ao abrir chamado.
- Criar vinculo explicito entre chamado e medida protetiva.
- Registrar relato do conselheiro sobre o que foi feito.
- Melhorar timeline do chamado.
- Separar medida aplicada de encaminhamento realizado quando necessario.

**Criterios de aceite:**

- Chamado possui medidas protetivas aplicadas.
- Encaminhamento registra relato do conselheiro e destino.
- Historico do chamado fica compreensivel.

### Issue 25 - Revisao final de seguranca e LGPD

**Tipo:** security/lgpd

**Modelo recomendado:** `gpt-5.6-sol`

**Objetivo:** Fazer checagem final antes de uso real.

**Escopo:**

- Revisar RLS.
- Revisar logs de auditoria.
- Revisar exposicao de dados sensiveis.
- Revisar formularios publicos.
- Atualizar documentacao de seguranca.

**Criterios de aceite:**

- Nenhuma rota publica lista dados sensiveis.
- Politicas de acesso foram testadas.
- Documentacao de seguranca esta atualizada.

## Milestone 9 - Produto Operacional E Relatorios

### Issue 26 - Fluxo visual completo do atendimento

**Tipo:** fullstack/business

**Modelo recomendado:** `gpt-5.5`

**Branch sugerida:** `issue/26-fluxo-operacional-completo`

**Objetivo:** Mostrar o fluxo real do atendimento, conectando denuncia, chamado, medida protetiva, encaminhamento e finalizacao.

**Escopo:**

- Representar no Kanban o fluxo: denuncia recebida, atribuida, em analise, chamado aberto, medida aplicada, encaminhamento registrado e finalizado.
- Exibir a etapa operacional derivada quando uma denuncia ja tiver chamado vinculado.
- Corrigir a exibicao de denuncia vinculada em chamado finalizado para nao parecer pendencia em analise.
- Criar helpers testaveis para calcular etapa operacional.
- Registrar auditoria nas transicoes relevantes.

**Criterios de aceite:**

- Kanban mostra todo o fluxo do sistema.
- Denuncia convertida em chamado acompanha o status do chamado.
- Chamado finalizado nao exibe denuncia vinculada como "em analise" ativa.
- Testes cobrem as etapas do fluxo.

### Issue 27 - Acessibilidade visual e identidade das telas

**Tipo:** frontend/ux

**Modelo recomendado:** `gpt-5.6-sol`

**Branch sugerida:** `issue/27-identidade-visual-fluxos`

**Objetivo:** Melhorar a leitura visual do painel e diferenciar melhor as areas administrativas.

**Escopo:**

- Diferenciar visualmente Denuncias, Chamados, Cadastros e Relatorios.
- Criar badges de status com cores semanticas e contraste adequado.
- Adicionar timeline/resumo de etapas em denuncia e chamado.
- Melhorar hierarquia visual de cards, titulos e acoes.
- Manter visual acolhedor e claro, evitando uma interface de uma cor so.

**Criterios de aceite:**

- Usuario entende rapidamente em qual tela esta.
- Status e etapas ficam claros por texto e cor.
- Interface continua responsiva e acessivel.

### Issue 28 - Cadastros auxiliares editaveis e compactos

**Tipo:** fullstack/admin-ui

**Modelo recomendado:** `gpt-5.5`

**Branch sugerida:** `issue/28-cadastros-editaveis-compactos`

**Objetivo:** Tornar motivos de denuncia e medidas protetivas mais faceis de manter.

**Escopo:**

- Trocar listas longas por visual compacto, com secoes recolhiveis ou tabela simples.
- Adicionar edicao de nome e descricao para motivos.
- Adicionar edicao de nome e descricao para medidas protetivas.
- Manter ativar/desativar.
- Exibir contadores de ativos e inativos.
- Registrar auditoria de edicao.

**Criterios de aceite:**

- Admin cria, edita, ativa e desativa motivos.
- Admin cria, edita, ativa e desativa medidas.
- Tela nao lista tudo aberto de forma cansativa.

### Issue 29 - Cadastro de conselheiros completo

**Tipo:** fullstack/admin/storage

**Modelo recomendado:** `gpt-5.5`

**Branch sugerida:** `issue/29-conselheiros-foto-telefones`

**Objetivo:** Melhorar o cadastro de conselheiros para uso real e exibicao publica.

**Escopo:**

- Permitir foto local em PNG/JPG, preferencialmente via Supabase Storage.
- Manter fallback com URL caso Storage ainda nao esteja configurado.
- Separar telefone fixo e telefone de plantao/WhatsApp.
- Deixar mandato padrao como `2024-2028`.
- Melhorar preview/lista de conselheiros cadastrados.
- Refletir dados publicos na area publica.

**Criterios de aceite:**

- Admin cadastra conselheiro com foto local.
- Mandato vem predefinido como `2024-2028`.
- Telefones fixo e plantao ficam separados.
- Conselheiro publico aparece corretamente na home.

### Issue 30 - Relatorios gerenciais avancados

**Tipo:** frontend/data-viz

**Modelo recomendado:** `gpt-5.6-sol`

**Branch sugerida:** `issue/30-relatorios-graficos-comparacao`

**Objetivo:** Evoluir relatorios de barras simples para visualizacoes gerenciais com comparacao.

**Escopo:**

- Adicionar graficos de barras.
- Adicionar grafico de pizza/donut para distribuicoes.
- Permitir selecionar categorias para comparacao.
- Comparar denuncias por motivo, chamados por status, chamados por conselheiro, medidas aplicadas e encaminhamentos.
- Manter filtro por periodo.
- Melhorar estados vazios.

**Criterios de aceite:**

- Relatorios mostram graficos claros.
- Usuario seleciona categorias para comparar.
- Dados respeitam filtros do periodo.
- Testes cobrem agregacoes e filtros.

### Issue 31 - Exportacao PDF de relatorios

**Tipo:** fullstack/reports

**Modelo recomendado:** `gpt-5.5`

**Branch sugerida:** `issue/31-exportacao-pdf-relatorios`

**Objetivo:** Permitir exportar relatorios selecionados em PDF.

**Escopo:**

- Criar selecao de blocos para exportacao.
- Permitir exportar comparacoes escolhidas.
- Incluir titulo, periodo, filtros, data de emissao e responsavel logado.
- Incluir tabelas resumidas dos graficos.
- Gerar PDF por fluxo seguro autenticado.

**Criterios de aceite:**

- Usuario autorizado exporta PDF com os blocos selecionados.
- PDF respeita filtros e categorias.
- Exportacao nao expoe dados sensiveis fora do painel autenticado.
