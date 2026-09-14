-- Closes a Supabase linter WARN ("function_search_path_mutable") raised
-- against the CMS trigger function added in 20260914045742_cms_content_schema.sql.
create or replace function public.set_content_updated_at()
returns trigger
language plpgsql
set search_path = public
as $fn$
begin
  new.updated_at = now();
  return new;
end;
$fn$;
