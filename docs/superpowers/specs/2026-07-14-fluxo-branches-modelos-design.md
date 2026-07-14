# Design - Fluxo De Branches, Issues E Modelos

## Objetivo

Definir um fluxo seguro para implementar o projeto por etapas, sem quebrar a base principal e sem tentar resolver muitas issues em uma unica conversa.

Este fluxo tambem define qual modelo de IA deve ser usado por tipo de tarefa, para que backend, frontend, banco, seguranca e documentacao sejam tratados com o nivel adequado de raciocinio.

## Estrategia De Branches

O repositorio tera tres niveis principais de branch:

- `main`: branch estavel e publicavel.
- `develop`: branch de integracao das entregas aprovadas.
- `issue/<numero>-<slug>`: branch curta para implementar uma unica GitHub Issue.

Todas as branches de issue devem nascer de `develop`, nao diretamente de `main`.

Exemplos:

- `issue/01-nextjs-base`
- `issue/02-ui-base`
- `issue/03-supabase-config`
- `issue/04-schema-supabase`

## Fluxo De Trabalho

1. Manter `main` como linha estavel.
2. Criar `develop` a partir de `main`.
3. Criar uma branch `issue/<numero>-<slug>` a partir de `develop`.
4. Implementar apenas o escopo da issue atual.
5. Rodar verificacoes relevantes.
6. Atualizar documentacao quando a issue alterar arquitetura, variaveis, schema, seguranca ou fluxo.
7. Integrar a branch da issue em `develop`.
8. Promover `develop` para `main` somente quando houver uma fatia funcional e revisada.

## Politica De Modelos Por Tipo De Tarefa

Use o modelo mais adequado ao risco da tarefa.

### `gpt-5.6-sol`

Usar para tarefas criticas:

- banco de dados;
- migrations;
- Supabase;
- Row Level Security;
- autenticacao;
- backend sensivel;
- regras de permissao;
- auditoria;
- revisao final de seguranca e LGPD;
- decisoes arquiteturais importantes.

### `gpt-5.5`

Usar para tarefas fullstack e investigacoes complexas:

- integracao entre frontend e Supabase;
- fluxos administrativos com regra de negocio;
- debugging pesado;
- revisoes de comportamento;
- tarefas que misturam UI, dados e seguranca.

### `gpt-5.6-terra`

Usar para tarefas de construcao equilibrada:

- frontend;
- layouts;
- componentes shadcn/ui;
- dashboard visual;
- documentacao tecnica media;
- ajustes de experiencia do usuario.

### `gpt-5.6-luna`

Usar para tarefas pequenas e mecanicas:

- revisao de texto;
- pequenas limpezas;
- ajustes simples de docs;
- renomeacoes;
- tarefas sem risco de dados sensiveis.

## Pre-Requisito Obrigatorio De Cada Issue

Antes de implementar qualquer issue, o agente deve registrar no inicio da tarefa:

```text
Tipo da issue:
Modelo recomendado:
Branch base:
Branch da issue:
Arquivos/documentos lidos:
Comandos de verificacao esperados:
```

Esse registro deve ser feito antes de alterar codigo.

## Classificacao Inicial Das Issues

| Issue | Tipo | Modelo recomendado |
| --- | --- | --- |
| #1 Inicializar projeto Next.js com TypeScript | fundacao/frontend | `gpt-5.6-terra` |
| #2 Configurar shadcn/ui e identidade visual base | frontend/ui | `gpt-5.6-terra` |
| #3 Configurar Supabase no projeto | backend/integracao | `gpt-5.6-sol` |
| #4 Criar schema inicial do banco no Supabase | database/security | `gpt-5.6-sol` |
| #5 Configurar autenticacao administrativa | auth/security | `gpt-5.6-sol` |
| #6 Configurar RLS e politicas de acesso | security/database | `gpt-5.6-sol` |
| #7 Criar site publico institucional | frontend/content | `gpt-5.6-terra` |
| #8 Criar formulario de denuncia anonima | fullstack/security | `gpt-5.5` |
| #9 Criar dashboard administrativo inicial | fullstack/ui | `gpt-5.5` |
| #10 Implementar listagem e detalhe de denuncias | fullstack/security | `gpt-5.5` |
| #11 Criar chamado a partir de denuncia | fullstack/business | `gpt-5.5` |
| #12 Implementar tela de chamados | fullstack/ui | `gpt-5.5` |
| #13 Implementar encaminhamentos e medidas protetivas | fullstack/business | `gpt-5.5` |
| #14 Implementar cadastros auxiliares | fullstack/admin | `gpt-5.5` |
| #15 Implementar relatorios basicos | fullstack/reporting | `gpt-5.5` |
| #16 Preparar deploy na Vercel | deploy/config | `gpt-5.6-sol` |
| #17 Revisao final de seguranca e LGPD | security/lgpd | `gpt-5.6-sol` |

## Criterios De Aceite Do Fluxo

- `main` nao recebe implementacao experimental direta.
- `develop` existe como base de integracao.
- Cada issue tem branch propria.
- Cada issue declara tipo, modelo recomendado e verificacoes antes da implementacao.
- O backlog e o contexto de IA documentam essa politica.
- Mudancas sensiveis usam modelos mais fortes.

