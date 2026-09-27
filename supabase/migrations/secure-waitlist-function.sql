create or replace function public.join_waitlist(
  p_email text,
  p_id uuid,
  p_placement text default null,
  p_source text default null,
  p_medium text default null,
  p_campaign text default null,
  p_consented_at timestamptz default now()
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  normalized_email text := lower(trim(p_email));
begin
  if normalized_email is null
    or length(normalized_email) not between 3 and 254
    or normalized_email !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  then
    raise exception using errcode = '22023', message = 'Invalid email address';
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

  return exists (
    select 1
    from public.waitlist_entries
    where email = normalized_email
  );
end;
$$;

revoke all on function public.join_waitlist(text, uuid, text, text, text, text, timestamptz) from public;
grant execute on function public.join_waitlist(text, uuid, text, text, text, text, timestamptz) to anon;

revoke all on table public.waitlist_entries from anon;

comment on function public.join_waitlist(text, uuid, text, text, text, text, timestamptz) is
  'Validates and persists one waitlist signup without exposing direct table access.';
