-- Best Team Tent Experience (Oct 13).
-- Every booth QR now carries two ratings:
--   cook teams:        Fan Favorite (teams.votes) + Tent Experience (teams.tent_votes)
--   hospitality tents: Tent Experience only
alter table teams add column if not exists tent_votes integer not null default 0;
alter table vote_log add column if not exists category text not null default 'fan_favorite';

create or replace function add_team_rating(p_team_id integer, p_rating integer)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not voting_is_open() then
    raise exception 'Voting is closed. Fan Favorite voting opens Wed Nov 11 at 12:30 PM.';
  end if;
  if p_rating is null or p_rating < 1 or p_rating > 5 then
    raise exception 'rating must be between 1 and 5';
  end if;
  update teams set votes = votes + p_rating
   where id = p_team_id and active and kind = 'Cooking';
  if not found then
    raise exception 'team % is not available for Fan Favorite voting', p_team_id;
  end if;
  insert into vote_log (team_id, rating, category) values (p_team_id, p_rating, 'fan_favorite');
end;
$$;

create or replace function add_tent_rating(p_team_id integer, p_rating integer)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not voting_is_open() then
    raise exception 'Voting is closed. Voting opens Wed Nov 11 at 12:30 PM.';
  end if;
  if p_rating is null or p_rating < 1 or p_rating > 5 then
    raise exception 'rating must be between 1 and 5';
  end if;
  update teams set tent_votes = tent_votes + p_rating where id = p_team_id and active;
  if not found then
    raise exception 'team % is not available for voting', p_team_id;
  end if;
  insert into vote_log (team_id, rating, category) values (p_team_id, p_rating, 'tent_experience');
end;
$$;

grant execute on function add_tent_rating(integer, integer) to anon, authenticated;

-- Fan Favorite eligibility = cook teams
update teams set vote_eligible = (kind = 'Cooking');

-- Roster updates (Oct 13 afternoon)
update teams set name = 'Verde Operating Company' where id = 93;
update teams set name = 'WaterBridge & LandBridge' where id = 118;
update teams set booth_number = '921' where id = 53;      -- Machinery Auctioneers
update teams set kind = 'Hospitality', vote_eligible = false where id = 131;  -- Merit Advisors
insert into teams (id, name, kind, vote_eligible, slug, scan_code, sort_order, votes, active, booth_number)
values (141, 'Bolton', 'Cooking', true, 'bolton-141', 'DEP26-' || upper(substr(md5(gen_random_uuid()::text), 1, 8)), 141, 0, true, '433')
on conflict (id) do nothing;
select setval('teams_id_seq', (select max(id) from teams));

-- New combined logos
update teams set logo_url = '/team-logos/42-gryphon-butchs-transcend-permian.png' where id = 42;
update teams set logo_url = '/team-logos/102-innio-waukesha-jenbacher-rps.png' where id = 102;

-- Bolton logo
update teams set logo_url = '/team-logos/141-bolton.png' where id = 141;
