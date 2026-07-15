create or replace function public.current_profile_role()
returns public.profile_role
language sql
stable
security definer
set search_path = public
as $$
  select profiles.role
  from public.profiles
  where profiles.id = (select auth.uid())
    and profiles.ativo = true
  limit 1
$$;

create or replace function public.is_active_conselheiro()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    public.current_profile_role() in ('conselheiro', 'admin'),
    false
  )
$$;

create or replace function public.is_active_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_profile_role() = 'admin', false)
$$;

alter table public.profiles enable row level security;
alter table public.conselho_tutelar enable row level security;
alter table public.motivos_denuncia enable row level security;
alter table public.denuncias enable row level security;
alter table public.vitimas enable row level security;
alter table public.chamados enable row level security;
alter table public.medidas_protetivas enable row level security;
alter table public.encaminhamentos enable row level security;
alter table public.chamado_medidas_protetivas enable row level security;
alter table public.audit_logs enable row level security;

create policy "profiles can read own active profile"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id and ativo = true);

create policy "admins can manage profiles"
on public.profiles for all
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());

create policy "public can read institution data"
on public.conselho_tutelar for select
to anon, authenticated
using (true);

create policy "admins can manage institution data"
on public.conselho_tutelar for all
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());

create policy "public can read active complaint reasons"
on public.motivos_denuncia for select
to anon, authenticated
using (ativo = true);

create policy "admins can manage complaint reasons"
on public.motivos_denuncia for all
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());

create policy "anonymous users can create complaints"
on public.denuncias for insert
to anon
with check (
  status = 'recebida'
  and observacoes_internas is null
);

create policy "authenticated users can create complaints"
on public.denuncias for insert
to authenticated
with check (
  status = 'recebida'
  and observacoes_internas is null
);

create policy "active counselors can read complaints"
on public.denuncias for select
to authenticated
using (public.is_active_conselheiro());

create policy "active counselors can update complaints"
on public.denuncias for update
to authenticated
using (public.is_active_conselheiro())
with check (public.is_active_conselheiro());

create policy "active counselors can read victims"
on public.vitimas for select
to authenticated
using (public.is_active_conselheiro());

create policy "active counselors can manage victims"
on public.vitimas for all
to authenticated
using (public.is_active_conselheiro())
with check (public.is_active_conselheiro());

create policy "active counselors can read cases"
on public.chamados for select
to authenticated
using (public.is_active_conselheiro());

create policy "active counselors can manage cases"
on public.chamados for all
to authenticated
using (public.is_active_conselheiro())
with check (public.is_active_conselheiro());

create policy "public can read active protective measures"
on public.medidas_protetivas for select
to anon, authenticated
using (ativo = true);

create policy "admins can manage protective measures"
on public.medidas_protetivas for all
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());

create policy "active counselors can read referrals"
on public.encaminhamentos for select
to authenticated
using (public.is_active_conselheiro());

create policy "active counselors can manage referrals"
on public.encaminhamentos for all
to authenticated
using (public.is_active_conselheiro())
with check (public.is_active_conselheiro());

create policy "active counselors can read case protective measures"
on public.chamado_medidas_protetivas for select
to authenticated
using (public.is_active_conselheiro());

create policy "active counselors can manage case protective measures"
on public.chamado_medidas_protetivas for all
to authenticated
using (public.is_active_conselheiro())
with check (public.is_active_conselheiro());

create policy "active counselors can read audit logs"
on public.audit_logs for select
to authenticated
using (public.is_active_conselheiro());

create policy "active counselors can create audit logs"
on public.audit_logs for insert
to authenticated
with check (public.is_active_conselheiro());

