-- run this in the Supabase SQL Editor to create the leads table and set the correct permissions

create table
  public.leads (
    id uuid not null default gen_random_uuid (),
    name text not null,
    email text not null,
    challenge text not null,
    created_at timestamp with time zone not null default now(),
    constraint leads_pkey primary key (id)
  ) tablespace pg_default;

-- enable Row Level Security
alter table public.leads enable row level security;

-- allow anyone to insert into the leads table (anon users submitting the form)
create policy "allow anon insert leads"
  on public.leads
  for insert
  to anon
  with check (true);

-- allow anyone to read leads (this enables your /admin page to read the data using the anon key)
-- if you wanted to secure it further, you would use Supabase Auth instead of a hardcoded VITE_ADMIN_SECRET
create policy "allow anon select leads"
  on public.leads
  for select
  to anon
  using (true);
