alter table public.denuncias
  add column if not exists vitima_nome_pai_informado text,
  add column if not exists vitima_nome_mae_informado text,
  add column if not exists vitima_escola_informada text,
  add column if not exists vitima_genero_informado text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'denuncias_vitima_genero_check'
      and conrelid = 'public.denuncias'::regclass
  ) then
    alter table public.denuncias
      add constraint denuncias_vitima_genero_check check (
        vitima_genero_informado is null
        or vitima_genero_informado in (
          'feminino',
          'masculino',
          'outro',
          'nao_informado'
        )
      );
  end if;
end $$;
