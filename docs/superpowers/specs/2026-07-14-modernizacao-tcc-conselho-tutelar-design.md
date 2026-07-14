# Design - Modernizacao do TCC Conselho Tutelar

## Objetivo

Reconstruir do zero o TCC "Sistema Web para Gerenciamento de Denuncias Anonimas Online do Conselho Tutelar de Sao Borja", usando o projeto de 2023 como especificacao historica e referencia de dominio, mas sem reaproveitar a base PHP antiga como fundacao tecnica.

A nova versao deve ser adequada para uso real pelo Conselho Tutelar, com foco em privacidade, seguranca, auditoria, organizacao dos atendimentos e possibilidade de deploy publico.

## Decisao Principal

Stack recomendada:

- Next.js com TypeScript para frontend e backend no mesmo projeto.
- Supabase para Postgres, autenticacao, politicas de acesso e storage futuro.
- Tailwind CSS e shadcn/ui para interface moderna e consistente.
- Vercel para deploy da aplicacao.

O PHP antigo sera mantido apenas como referencia de fluxos, tabelas e telas. A implementacao nova deve nascer limpa.

## Produto

O sistema tera duas areas principais.

Area publica:

- Pagina institucional do Conselho Tutelar de Sao Borja.
- Explicacao clara sobre o que e o Conselho Tutelar e quando aciona-lo.
- Contatos e localizacao.
- Formulario de denuncia anonima.
- Confirmacao apos envio.

Area administrativa:

- Login de conselheiros.
- Dashboard privado.
- Listagem de denuncias recebidas.
- Detalhe de denuncia.
- Criacao de chamado/caso a partir de denuncia.
- Cadastro e edicao de vitimas quando necessario.
- Cadastro de motivos de denuncia.
- Cadastro de medidas protetivas.
- Registro de encaminhamentos.
- Relatorios basicos.
- Logs de auditoria.

## Atores

Usuario publico:

- Acessa informacoes.
- Realiza denuncia anonima.
- Nao possui login.
- Nao consegue consultar denuncias enviadas.

Conselheiro:

- Acessa painel privado.
- Visualiza denuncias.
- Cria e acompanha chamados.
- Registra encaminhamentos e medidas.
- Atualiza status de atendimento.

Administrador:

- Possui permissoes de conselheiro.
- Gerencia usuarios, motivos, medidas e configuracoes institucionais.
- Acessa relatorios e auditoria.

## Modelo De Dados Inicial

Tabelas principais:

- `profiles`: dados complementares dos usuarios autenticados pelo Supabase Auth.
- `denuncias`: relatos anonimos enviados pela area publica.
- `vitimas`: dados de vitimas, criados quando o conselheiro formaliza o atendimento.
- `motivos_denuncia`: catalogo de tipos/motivos.
- `chamados`: casos derivados de denuncias ou cadastrados internamente.
- `medidas_protetivas`: catalogo de medidas aplicaveis.
- `encaminhamentos`: acoes/medidas tomadas em um chamado.
- `audit_logs`: registros de acoes sensiveis.
- `conselho_tutelar`: dados institucionais exibidos na area publica.

Relacao esperada:

- Uma denuncia possui um motivo.
- Uma denuncia pode virar um chamado.
- Um chamado pode ter uma vitima associada.
- Um chamado possui conselheiro responsavel.
- Um chamado pode ter varios encaminhamentos.
- Cada encaminhamento pode se relacionar a uma medida protetiva.

## Fluxo Publico

1. Usuario acessa o site.
2. Le informacoes sobre o Conselho Tutelar.
3. Abre o formulario de denuncia anonima.
4. Preenche motivo, relato e dados opcionais da vitima.
5. Envia a denuncia.
6. Sistema valida dados.
7. Sistema grava denuncia no Supabase com status inicial.
8. Usuario recebe confirmacao sem protocolo publico detalhado.

Observacao: por ser denuncia anonima e envolver dados sensiveis, o sistema nao deve permitir consulta publica posterior da denuncia.

## Fluxo Administrativo

1. Conselheiro acessa login.
2. Supabase Auth autentica o usuario.
3. Sistema carrega perfil e permissoes.
4. Conselheiro ve dashboard.
5. Conselheiro abre denuncias recebidas.
6. Conselheiro analisa uma denuncia.
7. Conselheiro cria chamado/caso.
8. Sistema registra auditoria.
9. Conselheiro associa vitima, motivo, status e responsavel.
10. Conselheiro registra encaminhamentos e medidas protetivas.
11. Chamado avanca de status ate finalizacao.

## Status Recomendados

Denuncia:

- `recebida`
- `em_analise`
- `convertida_em_chamado`
- `arquivada`

Chamado:

- `aberto`
- `em_atendimento`
- `finalizado`

## Seguranca E LGPD

Regras obrigatorias:

- Usar Supabase Auth para usuarios administrativos.
- Ativar Row Level Security em todas as tabelas sensiveis.
- Nao expor dados de denuncia em rotas publicas de leitura.
- Permitir insert publico de denuncia de forma controlada.
- Validar todos os dados no servidor.
- Registrar logs de auditoria para leitura/alteracao de denuncias e chamados.
- Diferenciar perfil `conselheiro` e `admin`.
- Evitar dados pessoais desnecessarios no formulario publico.
- Documentar tratamento de dados sensiveis e finalidade.

## Interface

Direcao visual:

- Visual serio, institucional e acolhedor.
- Evitar aparencia de template Bootstrap generico.
- Usar dashboard limpo, com tabelas legiveis e filtros claros.
- Formularios devem ser simples, com linguagem humana.
- Area publica deve transmitir confianca e privacidade.

Componentes esperados:

- Cards de indicadores.
- Tabelas com busca/filtro.
- Formularios por secoes.
- Badges de status.
- Dialogs para confirmacoes sensiveis.
- Timeline ou historico dentro do chamado.

## Relatorios MVP

Relatorios iniciais:

- Denuncias por motivo.
- Chamados por status.
- Chamados por conselheiro.
- Encaminhamentos por periodo.
- Medidas protetivas mais aplicadas.

Exportacao pode comecar em CSV/HTML imprimivel. PDF pode ficar para uma etapa posterior.

## Fora Do Escopo Inicial

Para manter o MVP entregavel, ficam fora do primeiro ciclo:

- Aplicativo mobile.
- Chat em tempo real.
- Upload de anexos.
- Consulta publica por protocolo.
- Integracao com WhatsApp.
- Assinatura digital.
- Notificacoes por e-mail/SMS.

Esses itens podem ser considerados depois que o fluxo principal estiver funcionando e seguro.

## Criterios De Aceite

O MVP sera considerado pronto quando:

- O site publico estiver online.
- Uma denuncia anonima puder ser enviada.
- Conselheiros conseguirem logar.
- Denuncias forem visiveis apenas na area privada.
- Um conselheiro puder converter denuncia em chamado.
- Chamados puderem receber encaminhamentos.
- Dashboard exibir dados reais.
- Relatorios basicos funcionarem.
- RLS estiver ativa nas tabelas sensiveis.
- Logs de auditoria forem gravados em acoes sensiveis.
- Houver README com instalacao, variaveis de ambiente e deploy.

## Ordem Recomendada

1. Criar projeto Next.js.
2. Configurar Supabase.
3. Criar schema inicial.
4. Configurar autenticacao.
5. Implementar area publica e formulario de denuncia.
6. Implementar painel privado.
7. Implementar denuncias e chamados.
8. Implementar encaminhamentos.
9. Implementar dashboard.
10. Implementar relatorios.
11. Revisar seguranca e RLS.
12. Fazer deploy.

