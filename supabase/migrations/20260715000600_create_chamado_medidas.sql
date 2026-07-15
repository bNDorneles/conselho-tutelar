create table if not exists public.chamado_medidas_protetivas (
  id uuid primary key default gen_random_uuid(),
  chamado_id uuid not null references public.chamados(id) on delete cascade,
  medida_protetiva_id uuid not null references public.medidas_protetivas(id),
  responsavel_id uuid references public.profiles(id) on delete set null,
  observacoes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_chamado_medidas_chamado_id
  on public.chamado_medidas_protetivas(chamado_id);
create index if not exists idx_chamado_medidas_medida_id
  on public.chamado_medidas_protetivas(medida_protetiva_id);

alter table public.chamado_medidas_protetivas enable row level security;

create policy "active counselors can read case protective measures"
on public.chamado_medidas_protetivas for select
to authenticated
using (public.is_active_conselheiro());

create policy "active counselors can manage case protective measures"
on public.chamado_medidas_protetivas for all
to authenticated
using (public.is_active_conselheiro())
with check (public.is_active_conselheiro());
