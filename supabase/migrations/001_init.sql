-- DEP BBQ Fan Favorite Voting — schema
-- Run this once in your Supabase project's SQL Editor (or via `supabase db push`).

create table if not exists teams (
  id serial primary key,
  name text not null,
  votes integer not null default 0,
  created_at timestamptz not null default now()
);

-- Optional audit log of every individual vote (handy for spotting bursts/abuse later).
create table if not exists vote_log (
  id bigserial primary key,
  team_id integer not null references teams(id) on delete cascade,
  voted_at timestamptz not null default now()
);

alter table teams enable row level security;
alter table vote_log enable row level security;

-- Anyone (the public anon key) can read team names + live vote counts.
drop policy if exists "Public read access on teams" on teams;
create policy "Public read access on teams"
  on teams for select
  using (true);

-- No direct insert/update/delete policies are granted on `teams` to anon.
-- All writes happen through increment_team_vote() below, so a fan's browser
-- can never PATCH an arbitrary vote count directly via the REST API —
-- it can only call the function, which adds exactly 1.

-- Function that safely records one vote. SECURITY DEFINER lets it update
-- `teams` even though the calling (anon) role has no table-level UPDATE grant.
create or replace function increment_team_vote(p_team_id integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update teams set votes = votes + 1 where id = p_team_id;
  insert into vote_log (team_id) values (p_team_id);
end;
$$;

grant execute on function increment_team_vote(integer) to anon;
grant execute on function increment_team_vote(integer) to authenticated;

-- Turn on realtime updates for the leaderboard page.
alter publication supabase_realtime add table teams;

-- Seed 110 placeholder teams. Rename these later (see README:
-- "Renaming teams") once you have the real team list.
insert into teams (name)
select 'Team ' || i
from generate_series(1, 110) as i
on conflict do nothing;
