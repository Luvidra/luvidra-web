create table if not exists public.waitlist_entries (
  id uuid primary key,
  email text not null,
  status text not null default 'subscribed',
  placement text,
  source text,
  medium text,
  campaign text,
  consented_at timestamptz not null,
  created_at timestamptz not null default now(),
  constraint waitlist_entries_email_unique unique (email)
);

alter table public.waitlist_entries enable row level security;

comment on table public.waitlist_entries is
  'Marketing waitlist signups written only by the server with the Supabase service role.';
