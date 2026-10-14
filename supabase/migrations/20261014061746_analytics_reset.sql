create or replace function public.fn_reset_analytics(p_confirm text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  removed jsonb;
begin
  if auth.role() is distinct from 'authenticated' then
    raise exception 'not authorized' using errcode = '42501';
  end if;

  if p_confirm is distinct from 'RESET' then
    raise exception 'confirmation phrase must be RESET' using errcode = '22023';
  end if;

  select jsonb_build_object(
    'visitors', (select count(*) from public.visitors),
    'sessions', (select count(*) from public.sessions),
    'page_views', (select count(*) from public.page_views),
    'events', (select count(*) from public.events)
  )
  into removed;

  truncate table public.events, public.page_views, public.sessions, public.visitors;

  return removed;
end;
$$;

revoke all on function public.fn_reset_analytics(text) from public, anon;
grant execute on function public.fn_reset_analytics(text) to authenticated;
