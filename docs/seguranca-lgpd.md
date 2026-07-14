# Seguranca E LGPD

Este sistema trata denuncias envolvendo criancas e adolescentes. Portanto, deve ser desenhado como sistema de dados sensiveis desde o inicio.

## Principios

- Coletar apenas dados necessarios.
- Nao expor denuncias publicamente.
- Proteger todas as telas administrativas.
- Registrar acoes sensiveis.
- Separar permissoes por perfil.
- Validar dados no servidor.
- Manter historico de atendimento.

## Dados Sensiveis

Dados como nome da vitima, endereco, escola, relato da denuncia, responsaveis, encaminhamentos e medidas protetivas devem ser considerados sensiveis.

## Regras Basicas

- O formulario publico pode inserir denuncia, mas nao pode listar, editar ou consultar denuncias.
- Conselheiros autenticados podem ver denuncias e chamados.
- Administradores podem gerenciar usuarios e configuracoes.
- Toda leitura/alteracao relevante deve gerar log de auditoria.
- Tabelas sensiveis devem usar Row Level Security no Supabase.

## Cuidados De Interface

- Avisar que a denuncia e anonima.
- Evitar pedir identificacao do denunciante.
- Informar que dados da vitima sao opcionais quando nao forem conhecidos.
- Usar linguagem clara e acolhedora.
- Evitar expor dados sensiveis em telas compartilhadas sem necessidade.

