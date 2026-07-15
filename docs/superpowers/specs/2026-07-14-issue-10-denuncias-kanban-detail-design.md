# Issue 10 - Denuncias Kanban E Detalhe

## Contexto

A area administrativa ja possui autenticacao por Supabase Auth, RLS e dashboard com dados reais. A Issue 10 deve permitir que conselheiros iniciem a triagem de denuncias recebidas pelo formulario anonimo.

## Decisoes

- A rota principal sera `/admin/denuncias`.
- A experiencia sera em formato Kanban, com colunas por status de denuncia.
- Cada card abre o detalhe em `/admin/denuncias/[id]`.
- Abrir o detalhe registra auditoria de leitura.
- Mover card entre colunas permitidas atualiza status e registra auditoria de alteracao de status.
- A conversao real para chamado nao faz parte desta issue. A coluna/status `convertida_em_chamado` pode aparecer para denuncias ja convertidas, mas a interface da Issue 10 nao cria chamado automaticamente.

## Status E Fluxo

As colunas seguem o enum `denuncia_status`:

- `recebida`
- `em_analise`
- `convertida_em_chamado`
- `arquivada`

Movimentos permitidos nesta issue:

- `recebida` para `em_analise`
- `em_analise` para `recebida`
- `em_analise` para `arquivada`
- `arquivada` para `em_analise`

O status `convertida_em_chamado` fica protegido para a Issue 11, onde sera criado o chamado real.

## Listagem Kanban

`/admin/denuncias` deve:

- exigir `requireAdminProfile()`;
- buscar denuncias reais no Supabase;
- permitir filtros por status, motivo e data inicial/final;
- mostrar cards com status, data, motivo e resumo do relato;
- oferecer link para o detalhe da denuncia;
- permitir mudanca de status por formularios/botoes sem depender de drag and drop nesta primeira versao.

O estilo deve seguir a identidade clara e tranquila ja definida: fundo acolhedor, cards discretos, densidade boa para trabalho administrativo.

## Detalhe

`/admin/denuncias/[id]` deve:

- exigir `requireAdminProfile()`;
- buscar uma denuncia real por id;
- registrar `audit_logs` com `action = 'read'`;
- mostrar relato completo, status, motivo, local, dados opcionais da vitima, datas e observacoes internas se existirem;
- oferecer retorno para o Kanban.

## Auditoria

Ao abrir detalhe:

- `user_id`: perfil autenticado;
- `action`: `read`;
- `entity`: `denuncias`;
- `entity_id`: id da denuncia;
- `metadata`: origem `admin_denuncia_detail`.

Ao mudar status:

- `user_id`: perfil autenticado;
- `action`: `status_change`;
- `entity`: `denuncias`;
- `entity_id`: id da denuncia;
- `metadata`: status anterior, status novo e origem `admin_denuncias_kanban`.

## Fora Do Escopo

- Criar chamado a partir de denuncia.
- Associar vitima formal.
- Drag and drop visual completo.
- Comentarios internos ou historico detalhado na tela.
- Relatorios.

## Verificacao

- Testes para regras de transicao e filtros.
- `npm run test`
- `npm run lint`
- `npm run build`
- Smoke check de `/admin/denuncias` sem sessao redirecionando para login.
