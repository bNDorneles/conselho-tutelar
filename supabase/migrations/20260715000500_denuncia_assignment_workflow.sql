alter type public.denuncia_status add value if not exists 'atribuida' after 'recebida';

alter table public.denuncias
  add column if not exists conselheiro_responsavel_id uuid
    references public.profiles(id) on delete set null;

create index if not exists idx_denuncias_conselheiro_responsavel_id
  on public.denuncias(conselheiro_responsavel_id);
