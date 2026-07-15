alter table public.profiles
  add column if not exists email text,
  add column if not exists telefone text,
  add column if not exists cargo text,
  add column if not exists foto_url text,
  add column if not exists sobre text,
  add column if not exists mandato text,
  add column if not exists exibir_publico boolean not null default false;

create policy "public can read visible counselors"
on public.profiles for select
to anon, authenticated
using (
  ativo = true
  and exibir_publico = true
  and role = 'conselheiro'
);
