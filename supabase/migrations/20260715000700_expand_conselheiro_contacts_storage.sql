alter table public.profiles
  add column if not exists telefone_fixo text,
  add column if not exists telefone_plantao text;

insert into storage.buckets (id, name, public)
values ('conselheiros', 'conselheiros', true)
on conflict (id) do update set public = true;

create policy "public can read counselor photos"
on storage.objects for select
using (bucket_id = 'conselheiros');

create policy "admins can manage counselor photos"
on storage.objects for all
using (
  bucket_id = 'conselheiros'
  and exists (
    select 1
    from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role = 'admin'
      and profiles.ativo = true
  )
)
with check (
  bucket_id = 'conselheiros'
  and exists (
    select 1
    from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role = 'admin'
      and profiles.ativo = true
  )
);
