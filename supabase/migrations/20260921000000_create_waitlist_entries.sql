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

grant select, insert on public.waitlist_entries to anon;
revoke update, delete on public.waitlist_entries from anon;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'waitlist_entries'
      and policyname = 'Allow public waitlist signups'
  ) then
    create policy "Allow public waitlist signups"
      on public.waitlist_entries
      for insert
      to anon
      with check (
        status = 'subscribed'
        and length(email) between 3 and 254
        and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
      );
  end if;
end
$$;

comment on table public.waitlist_entries is
  'Marketing waitlist signups accepted through an insert-only anonymous policy.';
