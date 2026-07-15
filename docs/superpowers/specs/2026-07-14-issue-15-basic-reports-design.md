# Issue 15 - Relatorios Basicos

## Contexto

O sistema ja registra denuncias, chamados e encaminhamentos. A Issue 15 cria uma visao gerencial simples para acompanhamento do Conselho Tutelar.

## Decisoes

- A rota sera `/admin/relatorios`.
- A tela exige usuario autenticado com perfil ativo.
- Relatorios usam dados reais do Supabase.
- A tela tera filtro por periodo (`data_inicio`, `data_fim`).
- Visualizacao sera por cards, tabelas compactas e barras horizontais em CSS.
- Nao sera adicionada biblioteca de graficos nesta issue.

## Relatorios

- Denuncias por motivo.
- Chamados por status.
- Chamados por conselheiro.
- Encaminhamentos por periodo.
- Medidas protetivas mais aplicadas.

## Fora Do Escopo

- Exportacao CSV/PDF.
- Graficos interativos.
- Relatorios customizados.

## Verificacao

- Testes para filtros e agregacoes.
- `npm run test`
- `npm run lint`
- `npm run build`
