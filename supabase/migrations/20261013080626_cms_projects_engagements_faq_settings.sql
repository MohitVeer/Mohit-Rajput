alter table public.projects
  add column if not exists slug text,
  add column if not exists kind text not null default 'case-study',
  add column if not exists sector text,
  add column if not exists employer text,
  add column if not exists role text,
  add column if not exists period text,
  add column if not exists status text not null default 'completed',
  add column if not exists highlights text[] not null default '{}';

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'projects_kind_check') then
    alter table public.projects
      add constraint projects_kind_check check (kind in ('client', 'accelerator', 'product', 'case-study'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'projects_status_check') then
    alter table public.projects
      add constraint projects_status_check check (status in ('ongoing', 'completed'));
  end if;
end $$;

create unique index if not exists projects_slug_key
  on public.projects (lower(slug))
  where slug is not null and slug <> '';

alter table public.articles
  add column if not exists slug text;

create unique index if not exists articles_slug_key
  on public.articles (lower(slug))
  where slug is not null and slug <> '';

create table if not exists public.engagements (
  id uuid primary key default gen_random_uuid(),
  employer text not null,
  role text not null,
  title text not null,
  period text not null,
  current boolean not null default false,
  kind text not null default 'client' check (kind in ('client', 'accelerator', 'product')),
  highlights text[] not null default '{}',
  stack text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

do $$
declare
  t text;
begin
  foreach t in array array['engagements', 'faqs', 'site_settings']
  loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_content_updated_at()', t);

    execute format('alter table public.%I enable row level security', t);

    execute format('drop policy if exists "public read %1$s" on public.%1$I', t);
    execute format('create policy "public read %1$s" on public.%1$I for select using (true)', t);

    execute format('drop policy if exists "admin write %1$s" on public.%1$I', t);
    execute format(
      'create policy "admin write %1$s" on public.%1$I for all using (auth.role() = ''authenticated'') with check (auth.role() = ''authenticated'')',
      t
    );
  end loop;
end $$;
