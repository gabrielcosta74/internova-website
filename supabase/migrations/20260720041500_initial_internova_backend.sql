-- Internova lead capture and editable site content.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  challenge text not null,
  created_at timestamptz not null default now(),
  status text not null default 'new'
    check (status in ('new', 'read', 'replied', 'archived')),
  notes text not null default ''
);

alter table public.leads enable row level security;

create policy "Allow public lead submissions"
  on public.leads for insert
  to anon
  with check (true);

-- The current admin UI reads and manages leads using the project's anon key.
create policy "Allow admin UI to read leads"
  on public.leads for select
  to anon
  using (true);

create policy "Allow admin UI to update leads"
  on public.leads for update
  to anon
  using (true)
  with check (true);

create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  section text not null,
  key text not null,
  value_pt text,
  value_en text,
  updated_at timestamptz not null default now(),
  unique (section, key)
);

alter table public.site_content enable row level security;

create policy "Allow public read site content"
  on public.site_content for select
  using (true);

create policy "Allow admin UI to insert site content"
  on public.site_content for insert
  to anon
  with check (true);

create policy "Allow admin UI to update site content"
  on public.site_content for update
  to anon
  using (true)
  with check (true);

create policy "Allow admin UI to delete site content"
  on public.site_content for delete
  to anon
  using (true);
