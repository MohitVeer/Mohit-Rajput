alter table public.experience
  add column if not exists documents jsonb not null default '[]'::jsonb;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('documents', 'documents', true, 10485760, array['application/pdf', 'image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "admin read documents" on storage.objects;
drop policy if exists "admin insert documents" on storage.objects;
drop policy if exists "admin update documents" on storage.objects;
drop policy if exists "admin delete documents" on storage.objects;

create policy "admin read documents" on storage.objects
  for select to authenticated using (bucket_id = 'documents');

create policy "admin insert documents" on storage.objects
  for insert to authenticated with check (bucket_id = 'documents');

create policy "admin update documents" on storage.objects
  for update to authenticated using (bucket_id = 'documents') with check (bucket_id = 'documents');

create policy "admin delete documents" on storage.objects
  for delete to authenticated using (bucket_id = 'documents');
