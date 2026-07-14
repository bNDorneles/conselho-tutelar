# Design - Issues 8 E 9 Denuncia Publica E Dashboard

## Objetivo

Implementar o envio publico de denuncia anonima e o primeiro dashboard administrativo com dados reais do Supabase.

## Issue #8 - Formulario De Denuncia Anonima

Inclui:

- rota `/denuncia`;
- formulario acolhedor com motivo, relato e dados opcionais da vitima;
- validacao com Zod;
- Server Action de envio;
- insert em `public.denuncias`;
- tela de confirmacao sem expor dados internos;
- CTA da home apontando para `/denuncia`.

Nao inclui:

- consulta publica por protocolo;
- upload de anexos;
- criacao de chamado;
- identificacao do denunciante.

## Issue #9 - Dashboard Administrativo Inicial

Inclui:

- cards com totais reais;
- denuncias recentes;
- chamados recentes;
- protecao existente por login/profile ativo;
- tratamento claro quando Supabase nao estiver configurado ou indisponivel.

Nao inclui:

- detalhe de denuncia;
- filtros avancados;
- criacao de chamado;
- relatorios completos.

## Decisoes De Segurança

- O formulario publico nao deve listar denuncias.
- A confirmacao nao deve devolver detalhes sensiveis.
- Server Actions validam dados antes do insert.
- Dashboard usa apenas server-side Supabase client protegido por auth e RLS.

## Criterios De Aceite

- Denuncia valida pode ser enviada.
- Dados invalidos retornam erro claro.
- Home aponta para `/denuncia`.
- Dashboard mostra cards e listas com dados reais.
- `npm run test`, `npm run lint` e `npm run build` passam apos cada issue.

