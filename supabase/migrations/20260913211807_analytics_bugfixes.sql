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
  group by 1
  order by 2 desc
  limit p_limit;
$$;

update sessions s
set page_view_count = coalesce(
  (select count(*) from page_views pv where pv.session_id = s.id), 0
)
where page_view_count <> coalesce(
  (select count(*) from page_views pv where pv.session_id = s.id), 0
);

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
    and s.started_at >= now() - interval '12 hours'
  order by s.last_activity_at desc;
$$;

do $$
declare
  backfill_ts timestamptz;
  affected int;
begin
  select last_activity_at into backfill_ts
  from sessions
  where ended_at is null
  group by last_activity_at
  having count(*) > 3
  order by count(*) desc
  limit 1;

  if backfill_ts is not null then
    update sessions
    set ended_at = started_at, duration_seconds = 0
    where ended_at is null and last_activity_at = backfill_ts;

    get diagnostics affected = row_count;
    raise notice 'closed out % session(s) stamped by the 0002 column backfill (%)', affected, backfill_ts;
  end if;
end $$;
