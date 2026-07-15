# Issue 12 - Tela De Chamados

## Contexto

A Issue 11 criou chamados a partir de denuncias. A Issue 12 deve permitir acompanhar esses casos em andamento pela area administrativa.

## Decisoes

- A listagem sera em `/admin/chamados`.
- O detalhe sera em `/admin/chamados/[id]`.
- A interface sera de lista operacional com filtros, nao Kanban.
- A tela exige `requireAdminProfile()`.
- Abertura de detalhe registra auditoria `read`.
- Alteracao de status registra auditoria `status_change`.

## Listagem

`/admin/chamados` deve listar chamados reais com:

- titulo;
- status;
- conselheiro responsavel, quando houver;
- vitima, quando houver;
- data de abertura;
- link para detalhe.

Filtros:

- status;
- conselheiro;
- data inicial;
- data final.

## Detalhe

`/admin/chamados/[id]` deve mostrar:

- titulo;
- descricao;
- status;
- data de abertura e data de fechamento;
- conselheiro responsavel;
- vitima vinculada, quando existir;
- denuncia vinculada, quando existir.

## Status

Status do enum `chamado_status`:

- `aberto`;
- `em_atendimento`;
- `finalizado`.

Transicoes permitidas nesta issue:

- `aberto` para `em_atendimento`;
- `em_atendimento` para `aberto`;
- `em_atendimento` para `finalizado`;
- `finalizado` para `em_atendimento`.

Ao mover para `finalizado`, preencher `data_fechamento`. Ao sair de `finalizado`, limpar `data_fechamento`.

## Fora Do Escopo

- Encaminhamentos.
- Medidas protetivas.
- Edicao de vitima.
- Comentarios internos.
- Relatorios.

## Verificacao

- Testes para filtros e transicoes.
- `npm run test`
- `npm run lint`
- `npm run build`
