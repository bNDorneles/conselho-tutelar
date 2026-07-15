# AI Context - Conselho Tutelar

Este arquivo e o contexto principal para qualquer IA, agente ou novo chat que for trabalhar neste repositorio. Leia este documento antes de propor arquitetura, escrever codigo, criar issues ou alterar escopo.

## Identidade Do Projeto

Repositorio: `bNDorneles/conselho-tutelar`

Projeto: nova versao do TCC "Sistema Web para Gerenciamento de Denuncias Anonimas Online do Conselho Tutelar de Sao Borja".

Objetivo: reconstruir do zero o projeto antigo de 2023, mantendo a ideia central do TCC, mas usando uma stack moderna, segura e publicavel.

Importante: este projeto e pensado para uso real por um Conselho Tutelar, nao apenas como demonstracao academica. Portanto, dados de denuncias, criancas, adolescentes, vitimas, responsaveis, relatos, chamados e encaminhamentos devem ser tratados como dados sensiveis.

## Regra Principal

Nao reaproveite o codigo PHP antigo como base tecnica.

O projeto antigo serve como referencia de negocio, fluxo, entidades e justificativa academica. A nova implementacao deve nascer limpa.

## Stack Decidida

Use:

- Next.js
- TypeScript
- Supabase
- Postgres
- Supabase Auth
- Supabase Row Level Security
- Tailwind CSS
- shadcn/ui
- Vercel

Evite:

- PHP procedural.
- Bootstrap como base visual principal.
- SQL manual inseguro.
- Login proprio com senha manual.
- Implementar tudo em uma unica entrega.

## Documentos Que Devem Ser Lidos

Antes de executar qualquer tarefa, leia:

- `docs/superpowers/specs/2026-07-14-modernizacao-tcc-conselho-tutelar-design.md`
- `docs/contexto-tcc-2023.md`
- `docs/decisao-arquitetura.md`
- `docs/seguranca-lgpd.md`
- `docs/github-issues.md`

## Problema Que O Sistema Resolve

O Conselho Tutelar recebe denuncias envolvendo direitos de criancas e adolescentes. Canais como ligacao, WhatsApp, Messenger ou Instagram podem expor ou intimidar o denunciante, reduzindo a chance de denuncia.

O sistema deve permitir que uma pessoa envie uma denuncia anonima pela internet e que conselheiros acompanhem essas denuncias em um painel privado, transformando relatos em chamados/casos e registrando encaminhamentos.

## Atores

### Usuario Publico

- Acessa o site publico.
- Le informacoes sobre o Conselho Tutelar.
- Envia denuncia anonima.
- Nao possui login.
- Nao pode consultar, listar ou editar denuncias enviadas.

### Conselheiro

- Faz login no painel administrativo.
- Visualiza denuncias recebidas.
- Analisa denuncias.
- Cria chamados/casos a partir de denuncias.
- Registra encaminhamentos e medidas protetivas.
- Atualiza status de atendimento.

### Administrador

- Possui permissoes de conselheiro.
- Gerencia conselheiros/perfis.
- Gerencia motivos de denuncia.
- Gerencia medidas protetivas.
- Edita dados institucionais.
- Acessa relatorios e auditoria.

## Areas Do Sistema

### Area Publica

Deve conter:

- Pagina institucional.
- Informacoes sobre o Conselho Tutelar.
- Explicacao sobre quando denunciar.
- Contatos e localizacao.
- Formulario de denuncia anonima.
- Confirmacao apos envio.

O formulario publico deve coletar o minimo necessario:

- Motivo/tipo da denuncia.
- Relato.
- Dados opcionais da vitima, quando conhecidos.

Nao pedir identificacao do denunciante no MVP.

### Area Administrativa

Deve conter:

- Login.
- Dashboard.
- Listagem de denuncias.
- Detalhe de denuncia.
- Criacao de chamado/caso.
- Listagem e detalhe de chamados.
- Registro de encaminhamentos.
- Cadastros auxiliares.
- Relatorios.
- Auditoria.

## Modelo De Dados Esperado

Tabelas previstas:

- `profiles`
- `denuncias`
- `vitimas`
- `motivos_denuncia`
- `chamados`
- `medidas_protetivas`
- `encaminhamentos`
- `audit_logs`
- `conselho_tutelar`

Relacionamento central:

1. Usuario publico cria uma `denuncia`.
2. Conselheiro analisa a `denuncia`.
3. Conselheiro pode converter a denuncia em `chamado`.
4. O `chamado` pode estar associado a uma `vitima`.
5. O `chamado` possui conselheiro responsavel.
6. O `chamado` recebe `encaminhamentos`.
7. Encaminhamentos podem usar `medidas_protetivas`.
8. Acoes sensiveis geram `audit_logs`.

## Status Recomendados

Denuncia:

- `recebida`
- `em_analise`
- `convertida_em_chamado`
- `arquivada`

Chamado:

- `aberto`
- `em_atendimento`
- `finalizado`

## Regras De Seguranca Obrigatorias

- Ativar RLS em tabelas sensiveis.
- Nao permitir leitura publica de denuncias.
- Permitir insert publico de denuncias apenas de forma controlada.
- Usar Supabase Auth para login administrativo.
- Diferenciar perfil `conselheiro` e `admin`.
- Registrar auditoria para leitura, criacao, edicao e mudanca de status em dados sensiveis.
- Validar dados no servidor.
- Nunca commitar `.env`, chaves privadas, tokens ou credenciais reais.
- Criar `.env.local.example` quando variaveis forem introduzidas.

## LGPD E Dados Sensiveis

Trate como sensiveis:

- Nome da vitima.
- Endereco.
- Escola.
- Nome de responsaveis.
- Relato da denuncia.
- Medidas aplicadas.
- Encaminhamentos.
- Historico de atendimento.

Evite coletar dados desnecessarios. O sistema deve ter linguagem clara, acolhedora e responsavel.

## Direcao Visual

A interface deve ser:

- Institucional.
- Moderna.
- Clara.
- Acolhedora.
- Seria.
- Responsiva.
- Diferente de template Bootstrap generico.

Paleta aprovada:

- Fundo claro/off-white quente.
- Primaria verde/teal serena.
- Secundaria azul suave.
- Acento pessego/amarelo discreto.
- Texto cinza-azulado escuro.
- Experiencia publica prioritariamente clara, tranquila e nao intimidante.

Evite dark mode como experiencia principal da area publica neste momento.

Use componentes como:

- Cards de indicadores.
- Tabelas com filtros.
- Badges de status.
- Formularios por secoes.
- Dialogs de confirmacao.
- Timeline/historico no detalhe do chamado.

Evite:

- Visual de landing page exagerada.
- Paleta muito chamativa.
- Textos decorativos sem funcao.
- Placeholders em telas finais.
- Interfaces que exponham dados sensiveis em excesso.

## Ordem De Implementacao

Nao tente implementar tudo de uma vez. Siga as GitHub Issues.

## Fluxo De Branches E Modelos

Antes de iniciar implementacao, leia tambem:

- `docs/superpowers/specs/2026-07-14-fluxo-branches-modelos-design.md`

Use este padrao de branches:

- `main`: branch estavel/publicavel.
- `develop`: branch de integracao.
- `issue/<numero>-<slug>`: branch de uma unica issue, sempre criada a partir de `develop`.

Antes de alterar codigo em qualquer issue, registre:

```text
Tipo da issue:
Modelo recomendado:
Branch base:
Branch da issue:
Arquivos/documentos lidos:
Comandos de verificacao esperados:
```

Politica de modelos:

- `gpt-5.6-sol`: banco, Supabase, RLS, auth, backend critico, auditoria, LGPD e arquitetura.
- `gpt-5.5`: tarefas fullstack, regras de negocio, debugging pesado e integracoes.
- `gpt-5.6-terra`: frontend, shadcn/ui, layouts, dashboards visuais e documentacao tecnica media.
- `gpt-5.6-luna`: ajustes pequenos, texto, limpeza e tarefas mecanicas de baixo risco.

Ordem recomendada:

1. Issue #1 - Inicializar projeto Next.js com TypeScript.
2. Issue #2 - Configurar shadcn/ui e identidade visual base.
3. Issue #3 - Configurar Supabase no projeto.
4. Issue #4 - Criar schema inicial do banco no Supabase.
5. Issue #5 - Configurar autenticacao administrativa.
6. Issue #6 - Configurar RLS e politicas de acesso.
7. Issue #7 - Criar site publico institucional.
8. Issue #8 - Criar formulario de denuncia anonima.
9. Issue #9 - Criar dashboard administrativo inicial.
10. Issue #10 - Implementar listagem e detalhe de denuncias.
11. Issue #11 - Criar chamado a partir de denuncia.
12. Issue #12 - Implementar tela de chamados.
13. Issue #13 - Implementar encaminhamentos e medidas protetivas.
14. Issue #14 - Implementar cadastros auxiliares.
15. Issue #15 - Implementar relatorios basicos.
16. Issue #16 - Preparar deploy na Vercel.
17. Issue #17 - Revisao final de seguranca e LGPD.

## Politica De Trabalho Para IAs

Ao iniciar um novo chat ou tarefa:

1. Leia este `ai.context.md`.
2. Leia os documentos em `docs/`.
3. Verifique a issue atual antes de mexer no codigo.
4. Trabalhe em uma issue por vez.
5. Evite expandir escopo sem registrar nova issue.
6. Antes de concluir, rode verificacoes relevantes.
7. Atualize documentacao quando alterar arquitetura, variaveis, schema ou fluxo.
8. Nunca remova protecoes de seguranca para "facilitar" a implementacao.

## Criterios Gerais De Qualidade

Toda entrega deve:

- Ter escopo pequeno e revisavel.
- Manter o projeto rodando.
- Evitar dados sensiveis expostos.
- Ter nomes claros em portugues ou ingles consistente.
- Ser facil de entender por outra IA ou pessoa desenvolvedora.
- Atualizar docs se mudar comportamento esperado.

## Estado Atual Do Projeto

No momento, o repositorio tem a base Next.js inicial criada pela Issue #1, a fundacao visual shadcn/ui criada pela Issue #2, a configuracao inicial Supabase criada pela Issue #3 e o schema inicial Supabase criado pela Issue #4.

Ja existem:

- Documentos de contexto.
- Especificacao inicial.
- Plano das Issues #1 e #2.
- Plano da Issue #3.
- Backlog em `docs/github-issues.md`.
- Issues abertas no GitHub.
- Codigo inicial Next.js com TypeScript, ESLint, Tailwind CSS e App Router.
- shadcn/ui configurado.
- Pagina publica inicial em `/`.
- Base visual administrativa em `/admin`.
- Helpers Supabase em `lib/supabase/`.
- `.env.local.example` com variaveis publicas do Supabase.
- Testes Vitest para validacao da configuracao Supabase.
- Migration inicial em `supabase/migrations/20260714000100_create_initial_schema.sql`.
- Seed seguro em `supabase/seed.sql`.
- Tipos iniciais do banco em `lib/supabase/database.types.ts`.
- Tela `/login`.
- Protecao server-side inicial de `/admin`.
- Server Actions de login/logout.
- Migration de RLS e policies em `supabase/migrations/20260714000200_enable_rls_policies.sql`.
- Formulario publico em `/denuncia`.
- Confirmacao publica em `/denuncia/enviada`.
- Dashboard administrativo com indicadores e listas recentes em `/admin`.
- Kanban de triagem em `/admin/denuncias`.
- Detalhe protegido de denuncia em `/admin/denuncias/[id]`.
- Auditoria de leitura e mudanca de status para denuncias.

Ainda nao existem:

- Conversao de denuncia em chamado.
- Tela de chamados.
- Deploy.

## Decisao Arquitetural Importante

Se houver duvida entre adaptar algo do PHP antigo ou criar limpo, escolha criar limpo, desde que preserve o fluxo de negocio do TCC.

Se houver duvida entre facilidade e seguranca, escolha seguranca.

Se houver duvida entre entregar tudo ou entregar uma fatia pequena funcional, escolha a fatia pequena funcional.
