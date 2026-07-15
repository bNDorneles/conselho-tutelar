insert into public.motivos_denuncia (nome, descricao)
values
  ('Negligencia', 'Situacoes de falta de cuidado, abandono ou omissao de responsaveis.'),
  ('Violencia fisica', 'Relatos de agressao ou castigo fisico contra crianca ou adolescente.'),
  ('Violencia psicologica', 'Relatos de ameaca, humilhacao, intimidacao ou abuso emocional.'),
  ('Violencia sexual', 'Suspeita ou relato de abuso, exploracao ou importunacao sexual.'),
  ('Trabalho infantil', 'Suspeita de exploracao de trabalho infantil.'),
  ('Evasao escolar', 'Situacoes persistentes de ausencia ou abandono escolar.'),
  ('Outro', 'Situacao que exige avaliacao do Conselho Tutelar.')
on conflict (nome) do nothing;

insert into public.medidas_protetivas (nome, descricao)
values
  ('Orientacao e acompanhamento', 'Orientacao aos responsaveis e acompanhamento do caso.'),
  ('Encaminhamento a rede de saude', 'Encaminhamento para atendimento de saude quando necessario.'),
  ('Encaminhamento a rede de assistencia social', 'Encaminhamento para servicos socioassistenciais.'),
  ('Comunicacao a escola', 'Contato com escola ou rede de ensino para acompanhamento.'),
  ('Comunicacao ao Ministerio Publico', 'Comunicacao ao Ministerio Publico quando cabivel.'),
  ('Requisicao de servico publico', 'Requisicao de atendimento por servico publico competente.')
on conflict (nome) do nothing;

insert into public.conselho_tutelar (
  nome,
  municipio,
  uf,
  endereco,
  telefone,
  email,
  horario_atendimento
)
values (
  'Conselho Tutelar',
  'Sao Borja',
  'RS',
  'Endereco institucional a confirmar',
  'Telefone institucional a confirmar',
  'email-institucional-a-confirmar@example.com',
  'Horario de atendimento a confirmar'
);

