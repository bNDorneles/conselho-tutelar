create extension if not exists pgcrypto;

create type public.profile_role as enum ('conselheiro', 'admin');
create type public.denuncia_status as enum (
  'recebida',
  'atribuida',
  'em_analise',
  'convertida_em_chamado',
  'arquivada'
);
create type public.chamado_status as enum (
  'aberto',
  'em_atendimento',
  'finalizado'
);
create type public.audit_action as enum (
  'create',
  'read',
  'update',
  'status_change',
  'delete'
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  email text,
  telefone text,
  cargo text,
  foto_url text,
  sobre text,
  mandato text,
  exibir_publico boolean not null default false,
  role public.profile_role not null default 'conselheiro',
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_nome_not_blank check (length(trim(nome)) > 0)
);

create table public.conselho_tutelar (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  municipio text not null,
  uf char(2) not null,
  endereco text,
  telefone text,
  email text,
  horario_atendimento text,
  whatsapp text,
  facebook_url text,
  instagram_url text,
  mapa_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint conselho_tutelar_nome_not_blank check (length(trim(nome)) > 0),
  constraint conselho_tutelar_municipio_not_blank check (length(trim(municipio)) > 0),
  constraint conselho_tutelar_uf_length check (length(trim(uf)) = 2)
);

create table public.motivos_denuncia (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint motivos_denuncia_nome_unique unique (nome),
  constraint motivos_denuncia_nome_not_blank check (length(trim(nome)) > 0)
);

create table public.denuncias (
  id uuid primary key default gen_random_uuid(),
  motivo_id uuid not null references public.motivos_denuncia(id),
  status public.denuncia_status not null default 'recebida',
  relato text not null,
  local_ocorrencia text,
  vitima_nome_informado text,
  vitima_idade_informada integer,
  vitima_endereco_informado text,
  vitima_nome_pai_informado text,
  vitima_nome_mae_informado text,
  vitima_escola_informada text,
  vitima_genero_informado text,
  conselheiro_responsavel_id uuid references public.profiles(id) on delete set null,
  observacoes_internas text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint denuncias_relato_not_blank check (length(trim(relato)) >= 20),
  constraint denuncias_vitima_idade_range check (
    vitima_idade_informada is null
    or vitima_idade_informada between 0 and 17
  ),
  constraint denuncias_vitima_genero_check check (
    vitima_genero_informado is null
    or vitima_genero_informado in (
      'feminino',
      'masculino',
      'outro',
      'nao_informado'
    )
  )
);

create table public.vitimas (
  id uuid primary key default gen_random_uuid(),
  nome text,
  data_nascimento date,
  idade_estimada integer,
  endereco text,
  escola text,
  responsavel_nome text,
  observacoes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint vitimas_idade_estimada_range check (
    idade_estimada is null
    or idade_estimada between 0 and 17
  )
);

create table public.chamados (
  id uuid primary key default gen_random_uuid(),
  denuncia_id uuid references public.denuncias(id) on delete set null,
  vitima_id uuid references public.vitimas(id) on delete set null,
  conselheiro_id uuid references public.profiles(id) on delete set null,
  status public.chamado_status not null default 'aberto',
  titulo text not null,
  descricao text,
  data_abertura timestamptz not null default now(),
  data_fechamento timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chamados_titulo_not_blank check (length(trim(titulo)) > 0),
  constraint chamados_data_fechamento_after_abertura check (
    data_fechamento is null
    or data_fechamento >= data_abertura
  )
);

create table public.medidas_protetivas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint medidas_protetivas_nome_unique unique (nome),
  constraint medidas_protetivas_nome_not_blank check (length(trim(nome)) > 0)
);

create table public.encaminhamentos (
  id uuid primary key default gen_random_uuid(),
  chamado_id uuid not null references public.chamados(id) on delete cascade,
  medida_protetiva_id uuid references public.medidas_protetivas(id) on delete set null,
  responsavel_id uuid references public.profiles(id) on delete set null,
  descricao text not null,
  orgao_destino text,
  data_encaminhamento timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint encaminhamentos_descricao_not_blank check (length(trim(descricao)) > 0)
);

create table public.chamado_medidas_protetivas (
  id uuid primary key default gen_random_uuid(),
  chamado_id uuid not null references public.chamados(id) on delete cascade,
  medida_protetiva_id uuid not null references public.medidas_protetivas(id),
  responsavel_id uuid references public.profiles(id) on delete set null,
  observacoes text,
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action public.audit_action not null,
  entity_table text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint audit_logs_entity_table_not_blank check (length(trim(entity_table)) > 0)
);

create index idx_profiles_role on public.profiles(role);
create index idx_profiles_ativo on public.profiles(ativo);

create index idx_motivos_denuncia_ativo on public.motivos_denuncia(ativo);

create index idx_denuncias_status on public.denuncias(status);
create index idx_denuncias_motivo_id on public.denuncias(motivo_id);
create index idx_denuncias_conselheiro_responsavel_id
  on public.denuncias(conselheiro_responsavel_id);
create index idx_denuncias_created_at on public.denuncias(created_at desc);

create index idx_vitimas_nome on public.vitimas(nome);

create index idx_chamados_status on public.chamados(status);
create index idx_chamados_conselheiro_id on public.chamados(conselheiro_id);
create index idx_chamados_denuncia_id on public.chamados(denuncia_id);
create index idx_chamados_vitima_id on public.chamados(vitima_id);
create index idx_chamados_data_abertura on public.chamados(data_abertura desc);

create index idx_medidas_protetivas_ativo on public.medidas_protetivas(ativo);

create index idx_encaminhamentos_chamado_id on public.encaminhamentos(chamado_id);
create index idx_encaminhamentos_medida_protetiva_id
  on public.encaminhamentos(medida_protetiva_id);
create index idx_encaminhamentos_data_encaminhamento
  on public.encaminhamentos(data_encaminhamento desc);

create index idx_chamado_medidas_chamado_id
  on public.chamado_medidas_protetivas(chamado_id);
create index idx_chamado_medidas_medida_id
  on public.chamado_medidas_protetivas(medida_protetiva_id);

create index idx_audit_logs_actor_id on public.audit_logs(actor_id);
create index idx_audit_logs_entity on public.audit_logs(entity_table, entity_id);
create index idx_audit_logs_created_at on public.audit_logs(created_at desc);

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger set_conselho_tutelar_updated_at
before update on public.conselho_tutelar
for each row execute function public.set_updated_at();

create trigger set_motivos_denuncia_updated_at
before update on public.motivos_denuncia
for each row execute function public.set_updated_at();

create trigger set_denuncias_updated_at
before update on public.denuncias
for each row execute function public.set_updated_at();

create trigger set_vitimas_updated_at
before update on public.vitimas
for each row execute function public.set_updated_at();

create trigger set_chamados_updated_at
before update on public.chamados
for each row execute function public.set_updated_at();

create trigger set_medidas_protetivas_updated_at
before update on public.medidas_protetivas
for each row execute function public.set_updated_at();

create trigger set_encaminhamentos_updated_at
before update on public.encaminhamentos
for each row execute function public.set_updated_at();

