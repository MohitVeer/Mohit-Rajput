-- Bug fixes found after 0002 went live against real traffic.

-- ── Bug 1: resume view/download never showed up in the admin dashboard ──
-- fn_top_labeled_events required `label is not null`, but
-- trackResumeView()/trackResumeDownload() call trackEvent() with no
-- label argument — those events (13 resume_view, 1 resume_download rows
-- confirmed in production at the time of this fix) were silently
-- excluded from every query built on this function. The function already
-- did `coalesce(label, '(none)')` in its SELECT, which only makes sense
-- if null labels are actually allowed through — the WHERE clause
-- contradicted that. Removing the filter is the fix; nothing else about
-- the function changes.
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

-- ── Bug 2: page_view_count was inflated by exactly +1 on every session ──
-- The track function's session_start handler hardcoded page_view_count:1
-- on insert. The client always sends a separate page_view event right
-- after session_start for the landing page too, and that event's
-- increment_page_view_count call counted it again — every session's
-- counter double-counted its own landing page. Confirmed directly
-- against production data: page_view_count was exactly (actual rows in
-- page_views + 1) for every normally-tracked session. This silently
-- understated bounce rate throughout (fn_overview/fn_country_breakdown
-- use `page_view_count <= 1` to detect a bounce, so a real single-page
-- visit — counted as 2 — never registered as one) and inflated
-- pages-per-session everywhere it's shown. The application-code half of
-- this fix is in netlify/functions/track.mts (dropping the hardcoded
-- value); this recomputes existing rows from ground truth — the actual
-- page_views rows — rather than guessing a correction, since a few
-- earlier sessions have inconsistent counts for unrelated reasons (e.g.
-- ones recorded before increment_page_view_count existed at all).
update sessions s
set page_view_count = coalesce(
  (select count(*) from page_views pv where pv.session_id = s.id), 0
)
where page_view_count <> coalesce(
  (select count(*) from page_views pv where pv.session_id = s.id), 0
);

-- ── Bug 3: "live visitors" briefly showed sessions from weeks ago ───────
-- 0002 added `last_activity_at timestamptz not null default now()` to
-- sessions. Adding a NOT NULL column with a DEFAULT backfills every
-- existing row with that default evaluated once, at ALTER TABLE time —
-- so every abandoned session ever recorded (some real visitors simply
-- close their tab without the pagehide/visibilitychange handler firing,
-- which isn't 100% reliable on every browser) got the exact same
-- "just now" timestamp the moment this migration ran, making months of
-- dead sessions look briefly live simultaneously. That already aged out
-- on its own (this fix landed hours later), but nothing stopped a
-- similar bulk-write from causing the same thing again. Bounding by
-- started_at too means a session has to have both started recently
-- *and* had activity recently to count as live — a single bulk-touched
-- last_activity_at can no longer resurrect an old session.
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

-- ── One-time cleanup: close out the sessions the 0002 backfill touched ──
-- Targets only a last_activity_at value shared by more than 3 still-open
-- sessions — real, independent visitors don't send heartbeats at the
-- exact same millisecond, so that many exact duplicates is the
-- fingerprint of a bulk column-default backfill, not real activity. The
-- `having count(*) > 3` guard matters: without it, on a database with no
-- such artifact at all, picking "whichever timestamp sorts first" could
-- close out one perfectly legitimate open session for no reason. Marks
-- matches ended at their own started_at with a 0s duration — we have no
-- real signal for how long they actually lasted, so a bounced-session
-- default is honest rather than inventing a plausible-looking one.
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
