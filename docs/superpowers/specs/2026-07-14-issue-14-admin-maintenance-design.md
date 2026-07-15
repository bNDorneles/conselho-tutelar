# Issue 14 - Cadastros Auxiliares

## Contexto

O sistema ja usa motivos, medidas protetivas, perfis e dados institucionais em fluxos reais. A Issue 14 cria uma area administrativa para manter esses dados.

## Decisoes

- A rota sera `/admin/cadastros`.
- Apenas `role = admin` e `ativo = true` pode acessar.
- Primeira versao inclui:
  - criar/ativar/desativar motivos de denuncia;
  - criar/ativar/desativar medidas protetivas;
  - editar dados institucionais do Conselho Tutelar;
  - listar perfis e ativar/desativar.
- Criacao de usuarios Auth pela tela fica fora do escopo por exigir service role/admin API.
- Acoes sensiveis registram auditoria.

## Verificacao

- Testes para validacao de inputs administrativos.
- `npm run test`
- `npm run lint`
- `npm run build`
