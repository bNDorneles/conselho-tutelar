insert into public.motivos_denuncia (nome, descricao)
values
  ('Desaparecimento/Fuga', 'Crianca ou adolescente desaparecido, em fuga ou sem paradeiro conhecido.'),
  ('Abuso Sexual', 'Suspeita ou relato de abuso sexual contra crianca ou adolescente.'),
  ('Violencia Sexual', 'Situacoes de violencia, exploracao ou importunacao sexual.'),
  ('Exploracao do Trabalho Infantil', 'Suspeita de trabalho infantil ou exploracao economica.'),
  ('Bullying', 'Violencia, intimidacao ou humilhacao recorrente entre pares.'),
  ('Negligencia', 'Falta de cuidado, abandono ou omissao de responsaveis.'),
  ('Maus tratos', 'Agressoes, castigos, humilhacoes ou tratamento degradante.'),
  ('Abandono', 'Crianca ou adolescente deixado sem cuidado ou protecao.'),
  ('Agressoes', 'Relatos de agressao fisica ou ameaca.'),
  ('Drogadicao', 'Uso abusivo de substancias envolvendo crianca, adolescente ou responsaveis.'),
  ('Alienacao Parental', 'Condutas que prejudiquem vinculo familiar ou convivio com responsavel.'),
  ('Uso de Bebida por Adolescente', 'Uso de bebida alcoolica por adolescente em situacao de risco.'),
  ('Ato Infracional', 'Pratica de ato infracional envolvendo adolescente.'),
  ('Conflito Familiar', 'Conflitos familiares com impacto na protecao da crianca ou adolescente.'),
  ('Comportamento', 'Mudancas de comportamento que indiquem risco ou necessidade de acompanhamento.'),
  ('Exploracao sexual', 'Exploracao sexual comercial ou situacao correlata.'),
  ('Problemas Psiquiatricos na Familia', 'Situacoes familiares com sofrimento psiquico que afetem protecao.'),
  ('Comportamento Depressivo e Suicida', 'Sinais de depressao, automutilacao ou risco de suicidio.'),
  ('Responsaveis Usuarios ou Dependentes', 'Responsaveis usuarios ou dependentes de alcool ou outras drogas.'),
  ('Outros', 'Situacao que exige avaliacao do Conselho Tutelar.')
on conflict (nome) do update set
  descricao = excluded.descricao,
  ativo = true,
  updated_at = now();

insert into public.medidas_protetivas (nome, descricao)
values
  ('Pedido de Certidao de Nascimento', 'Solicitacao de documento civil necessario ao atendimento.'),
  ('Pedido de Historico Escolar', 'Solicitacao de historico ou informacoes escolares.'),
  ('Acompanhamento Familiar', 'Acompanhamento da familia pelo Conselho ou rede de protecao.'),
  ('Termo de responsabilidade', 'Formalizacao de responsabilidade por cuidado e protecao.'),
  ('Termo de Compromisso', 'Registro de compromissos assumidos pelos responsaveis.'),
  ('Advertencia', 'Advertencia formal quando cabivel.'),
  ('Encaminhamento Psicologico', 'Encaminhamento para acompanhamento psicologico.'),
  ('Encaminhamento ao CREAS', 'Encaminhamento ao Centro de Referencia Especializado de Assistencia Social.'),
  ('Encaminhamento ao CRAS', 'Encaminhamento ao Centro de Referencia de Assistencia Social.'),
  ('Encaminhamento SMED', 'Encaminhamento a Secretaria Municipal de Educacao.'),
  ('Encaminhamento CAPS AD', 'Encaminhamento ao CAPS AD.'),
  ('Encaminhamento ao ESF', 'Encaminhamento a Estrategia Saude da Familia.'),
  ('Encaminhamento a Defensoria', 'Encaminhamento a Defensoria Publica.'),
  ('Encaminhamento ao MP', 'Encaminhamento ao Ministerio Publico.'),
  ('Encaminhamento a Delegacia', 'Encaminhamento a Delegacia quando necessario.'),
  ('Acolhimento Institucional', 'Medida excepcional de protecao em unidade adequada.'),
  ('Pedido de Vaga Escolar', 'Solicitacao de matricula ou vaga na rede de ensino.'),
  ('Outros', 'Outra medida protetiva ou encaminhamento definido pelo Conselho.')
on conflict (nome) do update set
  descricao = excluded.descricao,
  ativo = true,
  updated_at = now();

insert into public.conselho_tutelar (
  nome,
  municipio,
  uf,
  endereco,
  telefone,
  email,
  horario_atendimento,
  whatsapp,
  facebook_url,
  instagram_url,
  mapa_url
)
values (
  'Conselho Tutelar de Sao Borja',
  'Sao Borja',
  'RS',
  'Endereco institucional a confirmar',
  'Telefone institucional a confirmar',
  'email-institucional-a-confirmar@example.com',
  'Horario de atendimento a confirmar',
  'WhatsApp institucional a confirmar',
  'https://www.facebook.com/',
  'https://www.instagram.com/',
  null
)
on conflict do nothing;

