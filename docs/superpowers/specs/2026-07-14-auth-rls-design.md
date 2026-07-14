# Design - Issues 5 E 6 Auth Administrativa E RLS

## Objetivo

Implementar a base segura de acesso administrativo e versionar as politicas de Row Level Security do Supabase.

## Issue #5 - Autenticacao Administrativa

Inclui:

- pagina `/login`;
- Server Actions para login e logout;
- proxy de sessao Supabase para rotas administrativas;
- protecao de `/admin`;
- helper server-side para carregar usuario e profile ativo;
- estado de acesso pendente quando o usuario autenticado nao possui profile ativo;
- documentacao de variaveis e fluxo.

Nao inclui:

- criacao de usuarios reais;
- service role key;
- tela de gestao de conselheiros;
- recuperacao de senha;
- cadastro publico.

## Issue #6 - RLS E Politicas

Inclui:

- migration dedicada para habilitar RLS;
- funcoes SQL auxiliares para verificar profile ativo, conselheiro e admin;
- policies para bloquear leitura publica de dados sensiveis;
- insert anonimo controlado em `denuncias`;
- leitura administrativa para conselheiros/admins ativos;
- manutencao de catalogos e dados institucionais para admins;
- testes estaticos das policies.

Nao inclui:

- criacao de dados reais;
- bypass com service role;
- formularios reais gravando dados;
- auditoria automatica por trigger.

## Decisoes De Seguranca

- Server-side auth deve usar `auth.getClaims()` para proteger paginas, seguindo a recomendacao atual do Supabase SSR.
- `auth.getSession()` nao deve ser usado como fonte de autorizacao server-side.
- `profiles.id` continua vinculado a `auth.users.id`.
- RLS deve ser habilitado em todas as tabelas do schema publico criadas para o sistema.
- A policy publica de `denuncias` permite apenas `insert`, nunca `select`.
- Dados de `vitimas`, `chamados`, `encaminhamentos` e `audit_logs` nunca ficam publicamente legiveis.

## Ordem De Implementacao

1. Issue #5 em `issue/05-admin-auth`.
2. Merge da #5 em `develop`.
3. Issue #6 em `issue/06-rls-policies`.
4. Merge da #6 em `develop`.

## Criterios De Aceite

- `/admin` redireciona usuario nao autenticado para `/login`.
- Login e logout existem como Server Actions.
- Usuario autenticado sem profile ativo nao acessa dados administrativos.
- RLS e policies ficam versionadas em migration.
- Testes, lint e build passam apos cada issue.

