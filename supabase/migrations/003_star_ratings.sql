-- Switch Fan Favorite voting from single-tap votes to 1-5 star ratings.
-- The `teams.votes` column now holds the cumulative sum of every star
-- rating submitted for that team (e.g. three 5-star ratings = 15).
-- Run this in the Supabase SQL Editor.

alter table vote_log add column if not exists rating integer;

drop function if exists increment_team_vote(integer);

-- Records one star rating (1-5) and adds it to the team's running total.
create or replace function add_team_rating(p_team_id integer, p_rating integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_rating is null or p_rating < 1 or p_rating > 5 then
    raise exception 'rating must be between 1 and 5';
  end if;

  update teams set votes = votes + p_rating where id = p_team_id;
  insert into vote_log (team_id, rating) values (p_team_id, p_rating);
end;
$$;

grant execute on function add_team_rating(integer, integer) to anon;
grant execute on function add_team_rating(integer, integer) to authenticated;
