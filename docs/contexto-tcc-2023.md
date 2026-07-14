# Contexto Do TCC Original De 2023

O TCC original tinha como tema um sistema web para gerenciamento de denuncias anonimas online voltadas ao Conselho Tutelar de Sao Borja/RS.

Problema central:

- Canais como ligacao, WhatsApp, Messenger ou Instagram nao garantem anonimato suficiente.
- O medo de identificacao pode impedir denuncias envolvendo criancas e adolescentes.
- O Conselho Tutelar precisa receber, organizar e encaminhar relatos com mais agilidade.

Objetivo geral documentado:

- Desenvolver um sistema web para gerenciamento de denuncias anonimas online voltadas ao Conselho Tutelar do municipio de Sao Borja/RS.

Objetivos especificos:

1. Identificar requisitos e levantar dados.
2. Elaborar banco de dados, analise e modelagem.
3. Implementar a codificacao.
4. Testar o sistema e permitir denuncias anonimas online.

Versao antiga:

- PHP procedural.
- MySQL/MariaDB.
- XAMPP.
- Bootstrap.
- Codigo principal encontrado em `ultima/tcc`.
- Banco mais completo encontrado em `ultima/mydbbbb.sql`.

Funcionalidades antigas parcialmente implementadas:

- Pagina publica.
- Formulario de denuncia.
- Login administrativo.
- CRUD parcial de conselheiros, vitimas, motivos e medidas protetivas.
- Listagem de denuncias.

Pendencias antigas:

- Chamados/casos nao implementados de forma completa.
- Encaminhamentos nao implementados.
- Relatorios nao implementados.
- Dashboard limitado.
- Falhas de seguranca como SQL injection, senha MD5 e paginas admin sem protecao consistente.

Decisao da nova versao:

- Recriar do zero usando o TCC antigo como especificacao de negocio, nao como base tecnica.

