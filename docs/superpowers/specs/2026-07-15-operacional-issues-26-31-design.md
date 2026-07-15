# Design - Issues 26 A 31 Fluxo Operacional E Relatorios

## Contexto

Depois das Issues 21 a 24, o sistema passou a ter conselheiros, fluxo de denuncia, Kanban, chamados, medidas protetivas e encaminhamentos. A avaliacao visual mostrou que o produto ainda precisa comunicar melhor o fluxo real do atendimento e evoluir telas administrativas para uso diario.

Os principais pontos observados foram:

- o Kanban ainda mostra so parte do fluxo e nao deixa claro como denuncia, chamado, medida, encaminhamento e finalizacao se relacionam;
- algumas telas parecem muito parecidas visualmente, dificultando entender onde o usuario esta;
- chamado finalizado ainda permite reabrir facilmente e mostra a denuncia vinculada como se ela estivesse em analise;
- cadastros auxiliares listam muitos itens abertos e nao permitem edicao de nomes;
- cadastro de conselheiros precisa de foto local, mandato padrao e telefones separados;
- relatorios precisam de graficos, comparacao e exportacao em PDF.

## Issue 26 - Fluxo Visual Completo Do Atendimento

Tipo: fullstack/business

Modelo recomendado: `gpt-5.5`

Branch sugerida: `issue/26-fluxo-operacional-completo`

Objetivo: tornar o fluxo operacional visivel e consistente entre denuncia, chamado, medidas, encaminhamentos e finalizacao.

Fluxo esperado:

1. Denuncia recebida.
2. Denuncia atribuida a um conselheiro.
3. Denuncia em analise.
4. Chamado aberto.
5. Medida protetiva aplicada, quando houver.
6. Encaminhamento registrado.
7. Chamado finalizado.

Escopo:

- Ajustar os status exibidos no Kanban para representar o fluxo completo do atendimento.
- Exibir etapas de chamado dentro da jornada da denuncia quando houver chamado vinculado.
- Atualizar a exibicao da denuncia vinculada quando o chamado estiver finalizado.
- Evitar que uma denuncia convertida em chamado apareca como pendencia de analise.
- Criar helpers puros para calcular a etapa operacional exibida.
- Registrar auditoria nas transicoes relevantes.

Criterios de aceite:

- Kanban comunica o fluxo completo do atendimento.
- Denuncia convertida em chamado mostra o estado do chamado vinculado.
- Chamado finalizado nao aparece como "em analise" na denuncia vinculada.
- Testes cobrem o calculo das etapas e estados finais.

## Issue 27 - Acessibilidade Visual E Identidade Das Telas

Tipo: frontend/ux

Modelo recomendado: `gpt-5.6-sol`

Branch sugerida: `issue/27-identidade-visual-fluxos`

Objetivo: melhorar a leitura visual do painel administrativo sem perder o visual acolhedor.

Escopo:

- Diferenciar visualmente Denuncias, Chamados, Cadastros e Relatorios.
- Criar badges de status com cores semanticas e bom contraste.
- Adicionar uma timeline/resumo de etapas nas telas de detalhe de denuncia e chamado.
- Melhorar hierarquia visual de titulos, descricoes e acoes principais.
- Manter a paleta tranquila, evitando tema escuro e evitando uma interface de uma cor so.
- Garantir que botoes e textos fiquem legiveis em desktop e mobile.

Criterios de aceite:

- O usuario identifica rapidamente em qual area esta.
- Status importantes sao compreensiveis por cor e texto.
- Fluxo do atendimento fica claro sem depender de explicacoes longas.
- Lint, build e smoke visual das rotas administrativas passam.

## Issue 28 - Cadastros Auxiliares Editaveis E Compactos

Tipo: fullstack/admin-ui

Modelo recomendado: `gpt-5.5`

Branch sugerida: `issue/28-cadastros-editaveis-compactos`

Objetivo: transformar motivos de denuncia e medidas protetivas em cadastros editaveis e mais faceis de manter.

Escopo:

- Trocar listas longas abertas por visual compacto, com secoes recolhiveis ou tabela simples.
- Adicionar acao de editar nome e descricao de motivos de denuncia.
- Adicionar acao de editar nome e descricao de medidas protetivas.
- Manter ativar/desativar.
- Exibir contadores de ativos/inativos.
- Validar nome obrigatorio e evitar strings vazias.
- Registrar auditoria de edicao.

Criterios de aceite:

- Admin pode criar, editar, ativar e desativar motivos.
- Admin pode criar, editar, ativar e desativar medidas.
- Listas grandes ficam legiveis e nao dominam a tela.
- Testes cobrem payloads de criacao e edicao.

## Issue 29 - Cadastro De Conselheiros Completo

Tipo: fullstack/admin/storage

Modelo recomendado: `gpt-5.5`

Branch sugerida: `issue/29-conselheiros-foto-telefones`

Objetivo: melhorar o cadastro de conselheiros para uso real e exibicao publica.

Escopo:

- Permitir upload local de foto PNG/JPG pelo formulario.
- Armazenar a imagem no Supabase Storage ou, se Storage ainda nao estiver configurado, preparar fallback com URL e documentar o requisito.
- Trocar campo unico de telefone por:
  - telefone fixo;
  - telefone de plantao/WhatsApp.
- Deixar mandato predefinido como `2024-2028`.
- Manter cargo, resumo publico, ativo e exibir na area publica.
- Melhorar preview/lista de conselheiros cadastrados.
- Atualizar home publica para usar a nova foto e telefones quando disponiveis.

Criterios de aceite:

- Admin consegue cadastrar conselheiro com foto local.
- Mandato ja vem preenchido como `2024-2028`.
- Telefones fixo e plantao aparecem separados.
- Conselheiros publicos aparecem corretamente na area publica.

## Issue 30 - Relatorios Gerenciais Avancados

Tipo: frontend/data-viz

Modelo recomendado: `gpt-5.6-sol`

Branch sugerida: `issue/30-relatorios-graficos-comparacao`

Objetivo: evoluir relatorios de listas simples para paineis gerenciais com graficos e comparacao.

Escopo:

- Adicionar graficos de barras para rankings.
- Adicionar grafico de pizza/donut para distribuicoes.
- Permitir selecionar categorias para comparar.
- Permitir comparar duas ou mais categorias quando fizer sentido.
- Categorias iniciais:
  - denuncias por motivo;
  - chamados por status;
  - chamados por conselheiro;
  - medidas protetivas aplicadas;
  - encaminhamentos por periodo;
  - encaminhamentos por orgao destino.
- Manter filtro por periodo.
- Exibir estado vazio mais informativo quando nao houver dados.

Criterios de aceite:

- Relatorios exibem graficos claros e legiveis.
- Usuario pode selecionar categorias para comparacao.
- Dados continuam vindo do Supabase com filtros aplicados.
- Testes cobrem filtros, agregacoes e percentuais.

## Issue 31 - Exportacao PDF De Relatorios

Tipo: fullstack/reports

Modelo recomendado: `gpt-5.5`

Branch sugerida: `issue/31-exportacao-pdf-relatorios`

Objetivo: permitir exportar relatorios selecionados em PDF para apresentacao e arquivo.

Escopo:

- Criar interface para selecionar quais blocos entram no PDF.
- Permitir exportar comparacoes selecionadas.
- Incluir titulo, periodo, filtros, data de emissao e responsavel logado.
- Incluir tabelas resumidas dos graficos.
- Gerar PDF no servidor ou por rota dedicada segura.
- Evitar expor dados sensiveis fora do perfil autenticado.

Criterios de aceite:

- Admin/conselheiro autorizado consegue exportar PDF.
- PDF respeita filtros e categorias selecionadas.
- PDF possui layout limpo e informacoes suficientes para leitura externa.
- Testes cobrem selecao de blocos e permissao de acesso.

## Dependencias E Ordem

A ordem recomendada e:

1. Issue 26, porque define a regra operacional.
2. Issue 27, porque melhora a compreensao visual depois do fluxo estar correto.
3. Issue 28, porque resolve manutencao de catalogos.
4. Issue 29, porque melhora equipe publica e cadastro administrativo.
5. Issue 30, porque amplia consultas e visualizacao.
6. Issue 31, porque depende dos relatorios avancados.

## Dados E Banco

Possiveis alteracoes de banco:

- novos campos em `profiles` para telefone fixo e telefone plantao;
- possivel bucket de Storage para fotos de conselheiros;
- possiveis campos auxiliares para etapa operacional, se a regra nao puder ser derivada;
- nenhuma alteracao publica deve permitir leitura de denuncias, chamados, vitimas ou encaminhamentos.

## Testes

Cada issue deve rodar:

- `npm.cmd test`
- `npm.cmd run lint`
- `npm.cmd run build`

Testes especificos esperados:

- Issue 26: helpers de fluxo operacional e sincronizacao denuncia/chamado.
- Issue 27: helpers de status visual e ausencia de textos ambiguos.
- Issue 28: payloads de criacao/edicao e toggle de cadastros.
- Issue 29: payload de conselheiro, telefones e foto.
- Issue 30: agregacoes, filtros e comparacao.
- Issue 31: selecao de blocos e permissao/exportacao.
