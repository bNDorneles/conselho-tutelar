# Issue 11 - Criar Chamado A Partir De Denuncia

## Contexto

A Issue 10 criou a triagem administrativa de denuncias com Kanban, detalhe protegido e auditoria. A Issue 11 formaliza o atendimento criando um chamado vinculado a uma denuncia.

## Decisoes

- O botao ficara em `/admin/denuncias/[id]`.
- Apenas denuncias que ainda nao estao `convertida_em_chamado` poderao criar chamado.
- O chamado sera criado com `status = 'aberto'`.
- O `conselheiro_id` sera o perfil autenticado.
- A denuncia sera atualizada para `convertida_em_chamado` apos a criacao do chamado.
- A acao registrara auditoria em `audit_logs` com `action = 'create'` para o chamado e `action = 'status_change'` para a denuncia.

## Vitima

Se a denuncia tiver qualquer dado opcional de vitima, sera criado um registro em `vitimas` com:

- `nome` a partir de `vitima_nome_informado`;
- `idade_estimada` a partir de `vitima_idade_informada`;
- `endereco` a partir de `vitima_endereco_informado`;
- `observacoes` com a origem da denuncia.

Se a denuncia nao tiver dados de vitima, o chamado sera criado sem `vitima_id`.

## Chamado

O titulo inicial sera `Atendimento a partir de denuncia anonima`.

A descricao inicial usara o relato completo da denuncia. A edicao e acompanhamento detalhado ficam para a Issue 12.

## Fora Do Escopo

- Tela de listagem/detalhe de chamados.
- Edicao de vitima.
- Encaminhamentos e medidas protetivas.
- Transacao SQL/RPC dedicada. A acao sera sequencial usando RLS do usuario autenticado.

## Verificacao

- Testes para payload de vitima/chamado e bloqueio de denuncia ja convertida.
- `npm run test`
- `npm run lint`
- `npm run build`
