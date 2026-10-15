-- Run this once in Supabase: SQL Editor > New query > paste > Run.
-- Counts designs per user per day (day changes at midnight India time).

create table if not exists public.usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null,
  count int not null default 0,
  primary key (user_id, day)
);
alter table public.usage enable row level security;  -- no policies: browsers cannot read or write it

create or replace function public.consume_credit(p_user uuid, p_limit int)
returns int language plpgsql security definer set search_path = public as $$
declare d date := (now() at time zone 'Asia/Kolkata')::date; c int;
begin
  insert into public.usage(user_id, day, count) values (p_user, d, 0) on conflict do nothing;
  update public.usage u set count = u.count + 1
    where u.user_id = p_user and u.day = d and u.count < p_limit
    returning u.count into c;
  if c is null then return -1; end if;   -- limit reached
  return p_limit - c;                    -- designs left after this one
end $$;

create or replace function public.refund_credit(p_user uuid)
returns void language plpgsql security definer set search_path = public as $$
declare d date := (now() at time zone 'Asia/Kolkata')::date;
begin
  update public.usage u set count = greatest(u.count - 1, 0) where u.user_id = p_user and u.day = d;
end $$;

create or replace function public.credits_left(p_user uuid, p_limit int)
returns int language sql security definer set search_path = public as $$
  select greatest(p_limit - coalesce((select u.count from public.usage u
    where u.user_id = p_user and u.day = (now() at time zone 'Asia/Kolkata')::date), 0), 0)
$$;

-- Only the server (service role) may call these.
revoke all on function public.consume_credit(uuid, int) from public, anon, authenticated;
revoke all on function public.refund_credit(uuid) from public, anon, authenticated;
revoke all on function public.credits_left(uuid, int) from public, anon, authenticated;
grant execute on function public.consume_credit(uuid, int) to service_role;
grant execute on function public.refund_credit(uuid) to service_role;
grant execute on function public.credits_left(uuid, int) to service_role;
