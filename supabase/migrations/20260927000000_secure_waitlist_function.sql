create or replace function public.join_waitlist(
  p_email text,
  p_id uuid,
  p_fingerprint text,
  p_placement text default null,
  p_source text default null,
  p_medium text default null,
  p_campaign text default null,
  p_consented_at timestamptz default now()
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  normalized_email text := lower(trim(p_email));
  attempt_count integer;
begin
  if normalized_email is null
    or length(normalized_email) not between 3 and 254
    or normalized_email !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  then
    raise exception using errcode = '22023', message = 'Invalid email address';
  end if;

  if p_fingerprint !~ '^[a-f0-9]{64}$' then
    raise exception using errcode = '22023', message = 'Invalid request fingerprint';
  end if;

  insert into public.waitlist_rate_limits (fingerprint, window_started_at, attempts, updated_at)
  values (p_fingerprint, now(), 1, now())
  on conflict (fingerprint) do update
  set
    attempts = case
      when public.waitlist_rate_limits.window_started_at <= now() - interval '15 minutes' then 1
      else public.waitlist_rate_limits.attempts + 1
    end,
    window_started_at = case
      when public.waitlist_rate_limits.window_started_at <= now() - interval '15 minutes' then now()
      else public.waitlist_rate_limits.window_started_at
    end,
    updated_at = now()
  returning attempts into attempt_count;

  if attempt_count > 5 then
    return 'rate_limited';
  end if;

  insert into public.waitlist_entries (
    id,
    email,
    status,
    placement,
    source,
    medium,
    campaign,
    consented_at
  )
  values (
    p_id,
    normalized_email,
    'subscribed',
    left(p_placement, 24),
    left(p_source, 160),
    left(p_medium, 160),
    left(p_campaign, 160),
    p_consented_at
  )
  on conflict (email) do nothing;

  return 'accepted';
end;
$$;

create table if not exists public.waitlist_rate_limits (
  fingerprint text primary key,
  window_started_at timestamptz not null,
  attempts integer not null,
  updated_at timestamptz not null
);

alter table public.waitlist_rate_limits enable row level security;
revoke all on table public.waitlist_rate_limits from anon;

revoke all on function public.join_waitlist(text, uuid, text, text, text, text, timestamptz) from public;
revoke execute on function public.join_waitlist(text, uuid, text, text, text, text, timestamptz) from anon;
revoke all on function public.join_waitlist(text, uuid, text, text, text, text, text, timestamptz) from public;
grant execute on function public.join_waitlist(text, uuid, text, text, text, text, text, timestamptz) to anon;

revoke all on table public.waitlist_entries from anon;

comment on function public.join_waitlist(text, uuid, text, text, text, text, text, timestamptz) is
  'Rate limits, validates and persists one waitlist signup without exposing direct table access or raw IP addresses.';
