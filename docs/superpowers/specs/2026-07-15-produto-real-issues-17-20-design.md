# Design - Issues 17 A 20 Produto Real

## Contexto

As issues anteriores entregaram um MVP funcional com Supabase, autenticacao, formulario anonimo, painel administrativo, chamados, encaminhamentos, cadastros, relatorios e deploy inicial. O proximo bloco transforma a aplicacao em uma entrega mais proxima de uso real pelo Conselho Tutelar.

O foco das Issues 17 a 20 e corrigir quatro pontos percebidos pelo usuario:

- a area publica ainda possui linguagem tecnica e textos de MVP;
- o formulario de denuncia ainda coleta poucas informacoes quando comparado ao TCC antigo;
- os catalogos de motivos e medidas protetivas ainda nao refletem todos os dados antigos;
- a area administrativa precisa de uma sidebar para navegacao diaria.

## Issue 17 - Home Publica Institucional

A home deve deixar de explicar implementacao interna e passar a orientar o cidadao. Nao deve mencionar Supabase, RLS, MVP, autenticacao futura ou detalhes tecnicos.

A pagina deve mostrar:

- nome do Conselho Tutelar;
- endereco/localizacao;
- telefone;
- e-mail;
- WhatsApp;
- Facebook;
- Instagram;
- quando procurar o Conselho;
- chamada clara para fazer denuncia anonima;
- area reservada para equipe/conselheiros, mesmo que inicialmente sem fotos reais.

Dados institucionais devem vir da tabela `conselho_tutelar` quando disponiveis, com fallback seguro quando o banco ainda nao tiver os novos campos.

## Issue 18 - Formulario De Denuncia Mais Completo

O formulario deve seguir a estrutura essencial do TCC antigo, preservando o anonimato do denunciante.

Campos esperados:

- motivo da denuncia;
- relato detalhado;
- local da ocorrencia;
- nome informado da vitima;
- nome do pai;
- nome da mae;
- endereco da vitima;
- escola da vitima;
- idade da vitima;
- genero informado da vitima.

O sistema nao deve pedir identificacao obrigatoria do denunciante. Os campos de vitima continuam opcionais porque muitas denuncias anonimas chegam incompletas.

## Issue 19 - Catalogos Do TCC Antigo

Os catalogos devem trazer motivos e medidas protetivas do SQL antigo, normalizados para a nova aplicacao.

Motivos incluem, entre outros:

- Desaparecimento/Fuga;
- Abuso Sexual;
- Violencia Sexual;
- Exploracao do Trabalho Infantil;
- Bullying;
- Negligencia;
- Maus tratos;
- Abandono;
- Agressoes;
- Drogadicao;
- Alienacao Parental;
- Uso de Bebida por Adolescente;
- Ato Infracional;
- Conflito Familiar;
- Comportamento;
- Exploracao sexual;
- Problemas Psiquiatricos na Familia;
- Comportamento Depressivo e Suicida;
- Responsaveis Usuarios ou Dependentes;
- Outros.

Medidas incluem, entre outras:

- Pedido de Certidao de Nascimento;
- Pedido de Historico Escolar;
- Acompanhamento Familiar;
- Termo de responsabilidade;
- Termo de Compromisso;
- Advertencia;
- Encaminhamento Psicologico;
- Encaminhamento ao CREAS;
- Encaminhamento ao CRAS;
- Encaminhamento SMED;
- Encaminhamento CAPS AD;
- Encaminhamento ao ESF;
- Encaminhamento a Defensoria;
- Encaminhamento ao MP;
- Encaminhamento a Delegacia;
- Acolhimento Institucional;
- Pedido de Vaga Escolar;
- Outros.

Seeds devem ser idempotentes para evitar duplicacao quando reaplicados.

## Issue 20 - Sidebar Administrativa

A area administrativa deve ter layout compartilhado com sidebar, inspirado no TCC antigo, mas usando o visual atual.

Itens principais:

- Dashboard;
- Denuncias;
- Chamados;
- Conselheiros;
- Motivos;
- Medidas;
- Conselho;
- Relatorios;
- Area publica;
- Sair.

A sidebar deve destacar a rota ativa, funcionar em desktop e continuar aceitavel em telas menores. O layout nao deve duplicar cards dentro de cards nem depender de textos explicando como usar a aplicacao.

## Dados E Seguranca

As alteracoes de schema devem preservar RLS. A area publica pode inserir denuncias, mas nao pode ler denuncias, chamados, vitimas, encaminhamentos ou auditoria. Dados institucionais e conselheiros publicos podem ter leitura publica apenas quando explicitamente destinados a exibicao.

## Testes

Cada issue deve atualizar ou criar testes focados:

- Issue 17: helpers de dados institucionais e ausencia de textos tecnicos na home.
- Issue 18: validacao do formulario e payload de insert.
- Issue 19: testes estaticos de seed/migration para motivos e medidas.
- Issue 20: estrutura de navegacao administrativa e links principais.
