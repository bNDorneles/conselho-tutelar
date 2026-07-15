# Issue 13 - Encaminhamentos E Medidas Protetivas No Chamado

## Contexto

A tela de chamados ja permite listar, abrir detalhe e alterar status. A Issue 13 adiciona o registro de acoes tomadas durante o atendimento.

## Decisoes

- O formulario ficara em `/admin/chamados/[id]`.
- O historico/timeline de encaminhamentos sera exibido no detalhe do chamado.
- `descricao` sera obrigatoria.
- `medida_protetiva_id` e `orgao_destino` serao opcionais.
- `data_encaminhamento` podera ser informada; quando vazia, usa a data atual pelo banco.
- `responsavel_id` sera o perfil autenticado.
- Criar encaminhamento registra auditoria `create` em `audit_logs`.

## Fora Do Escopo

- Edicao/exclusao de encaminhamentos.
- CRUD de medidas protetivas.
- Relatorios de encaminhamentos.

## Verificacao

- Testes para validacao/payload de encaminhamento.
- `npm run test`
- `npm run lint`
- `npm run build`
