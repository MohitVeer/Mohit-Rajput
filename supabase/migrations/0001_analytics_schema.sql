-- Portfolio analytics schema
-- Deliberately does NOT store: raw IP addresses, precise coordinates,
-- ISP/ASN/organization data, or any device-fingerprint combination used
-- to re-identify a visitor. Identity is a random, disclosed, opt-outable
-- first-party id (visitor_uid) stored client-side.

create extension if not exists pgcrypto;

-- ── Core tables ─────────────────────────────────────────────────────────

create table if not exists visitors (
  id uuid primary key default gen_random_uuid(),
  visitor_uid text unique not null,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  total_sessions int not null default 0
);

create table if not exists sessions (
  id uuid primary key,                    -- client-generated (crypto.randomUUID())
  visitor_id uuid not null references visitors(id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_seconds int,
  entry_path text,
  exit_path text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  country text,
  region text,
  city text,
  timezone text,
  device_type text,        -- desktop | mobile | tablet
  os text,
  browser text,
  browser_version text,
  color_scheme text,       -- light | dark
  language text
);

create table if not exists page_views (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  path text not null,
  entered_at timestamptz not null default now(),
  duration_seconds int,
  max_scroll_pct smallint
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  path text,
  component text,           -- e.g. 'Hero', 'ProjectCard', 'Contact'
  action text not null,     -- e.g. 'click', 'resume_download', 'resume_view'
  label text,               -- e.g. project name, link destination
  occurred_at timestamptz not null default now(),
  meta jsonb
);

create index if not exists idx_sessions_visitor on sessions(visitor_id);
create index if not exists idx_sessions_started on sessions(started_at);
create index if not exists idx_page_views_session on page_views(session_id);
create index if not exists idx_events_session on events(session_id);
create index if not exists idx_events_action on events(action);

-- ── Row Level Security ──────────────────────────────────────────────────
-- Inserts happen only from the Netlify function using the service-role
-- key, which bypasses RLS entirely — no insert policy is needed for it,
-- and no anon/public insert policy is created, so the tables cannot be
-- written to directly from the browser.

alter table visitors enable row level security;
alter table sessions enable row level security;
alter table page_views enable row level security;
alter table events enable row level security;

create policy "admin read visitors" on visitors
  for select using (auth.role() = 'authenticated');
create policy "admin read sessions" on sessions
  for select using (auth.role() = 'authenticated');
create policy "admin read page_views" on page_views
  for select using (auth.role() = 'authenticated');
create policy "admin read events" on events
  for select using (auth.role() = 'authenticated');

-- ── Aggregate views for the dashboard ───────────────────────────────────

create or replace view daily_overview as
select
  date_trunc('day', s.started_at) as day,
  count(distinct s.id) as sessions,
  count(distinct s.visitor_id) as unique_visitors,
  avg(s.duration_seconds) filter (where s.duration_seconds is not null) as avg_session_seconds,
  count(*) filter (where s.total_pages_view = 1) as bounced_sessions
from (
  select s.*, count(pv.id) as total_pages_view
  from sessions s
  left join page_views pv on pv.session_id = s.id
  group by s.id
) s
group by 1
order by 1 desc;

create or replace view country_breakdown as
select coalesce(country, 'Unknown') as country, count(*) as sessions
from sessions
group by 1
order by 2 desc;

create or replace view device_breakdown as
select coalesce(device_type, 'Unknown') as device_type, count(*) as sessions
from sessions
group by 1
order by 2 desc;

create or replace view browser_breakdown as
select coalesce(browser, 'Unknown') as browser, count(*) as sessions
from sessions
group by 1
order by 2 desc;

create or replace view referrer_breakdown as
select
  case
    when referrer is null or referrer = '' then 'Direct'
    else referrer
  end as referrer,
  utm_source,
  count(*) as sessions
from sessions
group by 1, 2
order by 3 desc;

create or replace view resume_funnel as
select
  count(*) filter (where action = 'resume_view') as views,
  count(*) filter (where action = 'resume_download') as downloads
from events;

create or replace view top_certifications as
select label as certification, count(*) as views
from events
where component = 'Certification' and action = 'cert_view'
group by label
order by views desc;

create or replace view top_articles as
select label as article, count(*) as clicks
from events
where component = 'Article' and action = 'article_click'
group by label
order by clicks desc;

create or replace view outbound_link_breakdown as
select label, count(*) as clicks
from events
where component = 'ExternalLink'
group by label
order by clicks desc;

create or replace view section_engagement as
select
  path,
  avg(max_scroll_pct) as avg_scroll_pct,
  avg(duration_seconds) as avg_duration_seconds,
  count(*) as views
from page_views
group by path
order by views desc;
