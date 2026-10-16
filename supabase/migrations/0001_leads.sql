-- Leads del sitio (contacto rápido, contacto y cotización) y bucket privado de planos.
-- NO se ha aplicado en ningún proyecto. Aplicar con la CLI: `supabase db push`.
-- Solo el servidor escribe, con la service role (que se salta RLS). Sin políticas
-- públicas: la clave anónima no puede leer ni escribir nada.

create table if not exists public.leads (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  tipo       text not null check (tipo in ('rapido', 'contacto', 'cotizacion')),
  nombre     text not null,
  correo     text not null,
  telefono   text,
  -- Campos propios del tipo de formulario (proyecto, mensaje, ubicación, sistemas, ...).
  datos      jsonb not null default '{}'::jsonb,
  -- Planos subidos: [{nombre, path, mime, bytes}]. Los enlaces firmados no se guardan.
  archivos   jsonb not null default '[]'::jsonb,
  origen     text not null default 'web'
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);

alter table public.leads enable row level security;
-- Intencionalmente SIN `create policy`: nadie con anon/authenticated tiene acceso.
revoke all on table public.leads from anon, authenticated;

-- Bucket privado para planos (idempotente). Sin políticas en storage.objects: solo la
-- service role sube y firma enlaces. El límite de 10 MB se valida también en servidor.
insert into storage.buckets (id, name, public, file_size_limit)
values ('planos', 'planos', false, 10485760)
on conflict (id) do nothing;

-- Reversión manual (no destructiva por defecto; revisar antes de ejecutar):
--   drop table public.leads;
--   -- el bucket solo se puede borrar vacío: delete from storage.buckets where id = 'planos';
