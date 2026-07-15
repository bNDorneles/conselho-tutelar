# Design - Issue 4 Schema Inicial Supabase

## Objetivo

Criar o schema relacional inicial do sistema no Supabase/Postgres, versionado em migration SQL, com seeds basicos e tipos TypeScript atualizados.

## Escopo Desta Issue

Inclui:

- enums de status e perfil;
- tabelas principais do fluxo denuncia -> chamado -> encaminhamento;
- constraints, foreign keys e indices basicos;
- seeds iniciais de motivos de denuncia, medidas protetivas e dados institucionais genericos;
- atualizacao de `lib/supabase/database.types.ts`;
- teste estatico para garantir que a migration contem tabelas, enums e indices esperados.

Nao inclui:

- Row Level Security;
- policies;
- autenticacao administrativa;
- usuarios reais;
- dados reais do Conselho Tutelar;
- formulario publico gravando no banco.

## Modelo Relacional

Tabelas:

- `profiles`: perfil complementar de usuarios do Supabase Auth.
- `conselho_tutelar`: dados institucionais exibiveis no site.
- `motivos_denuncia`: catalogo de motivos.
- `denuncias`: relatos anonimos recebidos pela area publica.
- `vitimas`: dados da vitima quando conhecidos.
- `chamados`: caso formalizado a partir de uma denuncia.
- `medidas_protetivas`: catalogo de medidas.
- `encaminhamentos`: acoes tomadas em um chamado.
- `audit_logs`: historico de acoes sensiveis.

## Enums

- `profile_role`: `conselheiro`, `admin`.
- `denuncia_status`: `recebida`, `em_analise`, `convertida_em_chamado`, `arquivada`.
- `chamado_status`: `aberto`, `em_atendimento`, `finalizado`.
- `audit_action`: `create`, `read`, `update`, `status_change`, `delete`.

## Decisoes De Seguranca

- Dados sensiveis ficam separados entre denuncia, vitima e chamado.
- Campos publicos do envio anonimo coletam o minimo necessario.
- RLS sera ativado e detalhado na Issue #6, para manter esta issue focada no schema.
- A migration nao deve inserir denuncias, vitimas, chamados ou encaminhamentos reais.

## Seeds

Seeds permitidos:

- motivos de denuncia genericos;
- medidas protetivas genericas;
- registro institucional generico do Conselho Tutelar.

Seeds proibidos:

- nomes de criancas/adolescentes;
- relatos reais;
- enderecos reais de vitimas;
- usuarios/conselheiros reais.

## Criterios De Aceite

- Migration SQL criada em `supabase/migrations/`.
- Seed criado em `supabase/seed.sql`.
- Teste estatico cobre enums, tabelas e indices esperados.
- `database.types.ts` reflete o schema inicial.
- `npm run test` passa.
- `npm run lint` passa.
- `npm run build` passa.

