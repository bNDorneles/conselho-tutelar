# Backlog Inicial Para GitHub Issues

Este arquivo define as tarefas pequenas do projeto. A ideia e transformar cada item em uma GitHub Issue para trabalharmos por etapas, evitando implementar tudo em uma unica conversa.

## Milestone 1 - Fundacao Do Projeto

### Issue 1 - Inicializar projeto Next.js com TypeScript

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

**Objetivo:** Dar visao geral para conselheiros.

**Escopo:**

- Cards com total de denuncias, chamados abertos, em atendimento e finalizados.
- Lista de denuncias recentes.
- Lista de chamados recentes.

**Criterios de aceite:**

- Dashboard usa dados reais.
- Tela exige login.

### Issue 10 - Implementar listagem e detalhe de denuncias

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

**Objetivo:** Permitir manutencao dos dados de apoio.

**Escopo:**

- CRUD de motivos.
- CRUD de medidas protetivas.
- CRUD de conselheiros/perfis.
- Edicao de dados institucionais do Conselho Tutelar.

**Criterios de aceite:**

- Apenas admin acessa manutencoes sensiveis.
- Cadastros aparecem nos formularios correspondentes.

## Milestone 6 - Relatorios, Deploy E Fechamento

### Issue 15 - Implementar relatorios basicos

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

### Issue 17 - Revisao final de seguranca e LGPD

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

