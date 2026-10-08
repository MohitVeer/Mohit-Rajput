
alter table sessions
  add column if not exists country_code text,
  add column if not exists latitude numeric(8, 4),
  add column if not exists longitude numeric(8, 4),
  add column if not exists screen_width int,
  add column if not exists screen_height int,
  add column if not exists isp_org text,
  add column if not exists traffic_source text,
  add column if not exists is_returning boolean not null default false,
  add column if not exists current_path text,
  add column if not exists page_view_count int not null default 0,
  add column if not exists last_activity_at timestamptz not null default now();

create index if not exists idx_sessions_last_activity on sessions(last_activity_at);
create index if not exists idx_sessions_country on sessions(country);
create index if not exists idx_sessions_traffic_source on sessions(traffic_source);
create index if not exists idx_page_views_path on page_views(path);
create index if not exists idx_events_component_action on events(component, action);

create or replace function increment_page_view_count(p_session_id uuid, p_path text)
returns void
language sql as $$
  update sessions set page_view_count = page_view_count + 1, current_path = p_path
  where id = p_session_id;
$$;



create or replace function fn_overview(start_date timestamptz, end_date timestamptz)
returns table (
  visitors bigint,
  sessions bigint,
  page_views bigint,
  avg_session_seconds numeric,
  max_session_seconds numeric,
  min_session_seconds numeric,
  avg_pages_per_session numeric,
  bounce_rate numeric,
  returning_pct numeric,
  new_pct numeric
)
language sql stable as $$
  with s as (
    select * from sessions where started_at >= start_date and started_at < end_date
  )
  select
    count(distinct visitor_id),
    count(*),
    coalesce(sum(page_view_count), 0),
    avg(duration_seconds) filter (where duration_seconds is not null),
    max(duration_seconds),
    min(duration_seconds) filter (where duration_seconds is not null),
    avg(page_view_count) filter (where page_view_count > 0),
    case when count(*) = 0 then 0
      else round(100.0 * count(*) filter (where page_view_count <= 1) / count(*), 1)
    end,
    case when count(*) = 0 then 0
      else round(100.0 * count(*) filter (where is_returning) / count(*), 1)
    end,
    case when count(*) = 0 then 0
      else round(100.0 * count(*) filter (where not is_returning) / count(*), 1)
    end
  from s;
$$;

create or replace function fn_daily_series(start_date timestamptz, end_date timestamptz)
returns table (day date, visitors bigint, sessions bigint, page_views bigint)
language sql stable as $$
  select
    date_trunc('day', started_at)::date as day,
    count(distinct visitor_id),
    count(*),
    coalesce(sum(page_view_count), 0)
  from sessions
  where started_at >= start_date and started_at < end_date
  group by 1
  order by 1;
$$;

create or replace function fn_country_breakdown(start_date timestamptz, end_date timestamptz)
returns table (
  country text, country_code text, visitors bigint, sessions bigint,
  page_views bigint, avg_seconds numeric, bounce_rate numeric
)
language sql stable as $$
  select
    coalesce(country, 'Unknown'),
    coalesce(country_code, ''),
    count(distinct visitor_id),
    count(*),
    coalesce(sum(page_view_count), 0),
    avg(duration_seconds) filter (where duration_seconds is not null),
    case when count(*) = 0 then 0
      else round(100.0 * count(*) filter (where page_view_count <= 1) / count(*), 1)
    end
  from sessions
  where started_at >= start_date and started_at < end_date
  group by 1, 2
  order by 3 desc;
$$;

create or replace function fn_city_breakdown(start_date timestamptz, end_date timestamptz)
returns table (
  city text, region text, country text, visitors bigint, sessions bigint,
  avg_seconds numeric, avg_pages_per_session numeric, latitude numeric, longitude numeric
)
language sql stable as $$
  select
    coalesce(city, 'Unknown'),
    coalesce(region, ''),
    coalesce(country, 'Unknown'),
    count(distinct visitor_id),
    count(*),
    avg(duration_seconds) filter (where duration_seconds is not null),
    avg(page_view_count) filter (where page_view_count > 0),
    avg(latitude),
    avg(longitude)
  from sessions
  where started_at >= start_date and started_at < end_date and city is not null
  group by 1, 2, 3
  order by 5 desc;
$$;


create or replace function fn_device_breakdown(start_date timestamptz, end_date timestamptz)
returns table (device_type text, sessions bigint)
language sql stable as $$
  select coalesce(device_type, 'Unknown'), count(*)
  from sessions
  where started_at >= start_date and started_at < end_date
  group by 1 order by 2 desc;
$$;

create or replace function fn_browser_breakdown(start_date timestamptz, end_date timestamptz)
returns table (browser text, sessions bigint)
language sql stable as $$
  select coalesce(browser, 'Unknown'), count(*)
  from sessions
  where started_at >= start_date and started_at < end_date
  group by 1 order by 2 desc;
$$;

create or replace function fn_os_breakdown(start_date timestamptz, end_date timestamptz)
returns table (os text, sessions bigint)
language sql stable as $$
  select coalesce(os, 'Unknown'), count(*)
  from sessions
  where started_at >= start_date and started_at < end_date
  group by 1 order by 2 desc;
$$;


create or replace function fn_traffic_source_breakdown(start_date timestamptz, end_date timestamptz)
returns table (
  source text, visitors bigint, sessions bigint,
  avg_pages_per_session numeric, avg_seconds numeric
)
language sql stable as $$
  select
    coalesce(traffic_source, 'Direct'),
    count(distinct visitor_id),
    count(*),
    avg(page_view_count) filter (where page_view_count > 0),
    avg(duration_seconds) filter (where duration_seconds is not null)
  from sessions
  where started_at >= start_date and started_at < end_date
  group by 1 order by 3 desc;
$$;


create or replace function fn_popular_pages(start_date timestamptz, end_date timestamptz)
returns table (
  path text, views bigint, unique_visitors bigint, avg_seconds numeric,
  max_seconds numeric, entries bigint, exits bigint, bounce_rate numeric
)
language sql stable as $$
  with pv as (
    select pv.*, s.visitor_id, s.entry_path, s.exit_path, s.page_view_count
    from page_views pv
    join sessions s on s.id = pv.session_id
    where pv.entered_at >= start_date and pv.entered_at < end_date
  )
  select
    path,
    count(*),
    count(distinct visitor_id),
    avg(duration_seconds) filter (where duration_seconds is not null),
    max(duration_seconds),
    count(*) filter (where path = entry_path),
    count(*) filter (where path = exit_path),
    case when count(*) filter (where path = entry_path) = 0 then 0
      else round(100.0 *
        count(*) filter (where path = entry_path and page_view_count <= 1)
        / count(*) filter (where path = entry_path), 1)
    end
  from pv
  group by path
  order by 2 desc;
$$;


create or replace function fn_top_labeled_events(
  p_component text, p_action text, start_date timestamptz, end_date timestamptz, p_limit int default 10
)
returns table (label text, total bigint, unique_sessions bigint)
language sql stable as $$
  select
    coalesce(label, '(none)'),
    count(*),
    count(distinct session_id)
  from events
  where component = p_component and action = p_action
    and occurred_at >= start_date and occurred_at < end_date
    and label is not null
  group by 1
  order by 2 desc
  limit p_limit;
$$;

create or replace function fn_event_type_breakdown(start_date timestamptz, end_date timestamptz)
returns table (component text, action text, total bigint, unique_sessions bigint)
language sql stable as $$
  select
    coalesce(component, '(none)'),
    action,
    count(*),
    count(distinct session_id)
  from events
  where occurred_at >= start_date and occurred_at < end_date
  group by 1, 2
  order by 3 desc;
$$;

create or replace function fn_scroll_milestones(start_date timestamptz, end_date timestamptz)
returns table (milestone int, page_views bigint)
language sql stable as $$
  select (meta->>'milestone')::int, count(distinct session_id || path)
  from events
  where component = 'Scroll' and action = 'scroll_depth'
    and occurred_at >= start_date and occurred_at < end_date
  group by 1 order by 1;
$$;


create or replace function fn_engagement(start_date timestamptz, end_date timestamptz)
returns table (
  avg_pages_per_session numeric,
  avg_engagement_seconds numeric,
  resume_interaction_rate numeric,
  contact_interaction_rate numeric,
  cta_click_rate numeric
)
language sql stable as $$
  with s as (
    select * from sessions where started_at >= start_date and started_at < end_date
  ),
  total as (select count(*) as n from s),
  resume_sessions as (
    select count(distinct e.session_id) as n from events e join s on s.id = e.session_id
    where e.component = 'Resume' and e.occurred_at >= start_date and e.occurred_at < end_date
  ),
  contact_sessions as (
    select count(distinct e.session_id) as n from events e join s on s.id = e.session_id
    where e.component in ('Contact', 'ExternalLink')
      and e.occurred_at >= start_date and e.occurred_at < end_date
  ),
  cta_sessions as (
    select count(distinct e.session_id) as n from events e join s on s.id = e.session_id
    where e.action in ('cta_click', 'click') and e.occurred_at >= start_date and e.occurred_at < end_date
  )
  select
    (select avg(page_view_count) filter (where page_view_count > 0) from s),
    (select avg(duration_seconds) filter (where duration_seconds is not null) from s),
    case when (select n from total) = 0 then 0
      else round(100.0 * (select n from resume_sessions) / (select n from total), 1) end,
    case when (select n from total) = 0 then 0
      else round(100.0 * (select n from contact_sessions) / (select n from total), 1) end,
    case when (select n from total) = 0 then 0
      else round(100.0 * (select n from cta_sessions) / (select n from total), 1) end;
$$;

create or replace function fn_conversion_funnel(start_date timestamptz, end_date timestamptz)
returns table (
  visitors bigint, engaged_visitors bigint, contact_intent bigint, contact_submissions bigint
)
language sql stable as $$
  with s as (
    select * from sessions where started_at >= start_date and started_at < end_date
  )
  select
    (select count(distinct visitor_id) from s),
    (select count(distinct visitor_id) from s where page_view_count >= 2 or duration_seconds >= 30),
    (select count(distinct s.visitor_id) from s join events e on e.session_id = s.id
      where e.occurred_at >= start_date and e.occurred_at < end_date
        and (e.path = '/#contact' or e.component in ('Contact', 'ExternalLink'))),
    (select count(distinct s.visitor_id) from s join events e on e.session_id = s.id
      where e.occurred_at >= start_date and e.occurred_at < end_date
        and e.action in ('contact_form_submit', 'email_click'));
$$;


create or replace function fn_live_visitors(minutes int default 5)
returns table (
  session_id uuid, visitor_short text, country text, city text,
  device_type text, current_path text, entry_path text,
  started_at timestamptz, last_activity_at timestamptz
)
language sql stable as $$
  select
    s.id,
    left(v.visitor_uid, 8),
    s.country, s.city, s.device_type,
    coalesce(s.current_path, s.entry_path),
    s.entry_path,
    s.started_at,
    s.last_activity_at
  from sessions s
  join visitors v on v.id = s.visitor_id
  where s.ended_at is null
    and s.last_activity_at >= now() - (minutes || ' minutes')::interval
  order by s.last_activity_at desc;
$$;


create or replace function fn_session_timeline(p_session_id uuid)
returns table (
  at timestamptz, kind text, path text, label text, duration_seconds int
)
language sql stable as $$
  select entered_at, 'page_view', path, null::text, duration_seconds
  from page_views where session_id = p_session_id
  union all
  select occurred_at, 'event', path, coalesce(component || ' · ' || action || coalesce(' · ' || label, ''), action), null
  from events where session_id = p_session_id
  order by 1;
$$;

do $$
begin
  execute 'alter publication supabase_realtime add table sessions';
exception when others then
  raise notice 'supabase_realtime publication step skipped (already added, or publication missing): %', sqlerrm;
end $$;

grant execute on all functions in schema public to authenticated;

revoke execute on function increment_page_view_count(uuid, text) from public, authenticated;
