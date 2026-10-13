-- Lock Fan Favorite voting to the event window.
-- Votes are only accepted Wed Nov 11, 2026, 12:30-7:30 PM Central, or at any
-- time event_settings.voting_open is set to true (manual override).

create or replace function voting_is_open()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select now() >= timestamptz '2026-11-11 12:30 America/Chicago'
     and now() <  timestamptz '2026-11-11 19:30 America/Chicago'
      or coalesce((select voting_open from event_settings where id), false);
$$;

grant execute on function voting_is_open() to anon, authenticated;

create or replace function add_team_rating(p_team_id integer, p_rating integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not voting_is_open() then
    raise exception 'Voting is closed. Fan Favorite voting opens Wed Nov 11 at 12:30 PM.';
  end if;
  if p_rating is null or p_rating < 1 or p_rating > 5 then
    raise exception 'rating must be between 1 and 5';
  end if;

  update teams set votes = votes + p_rating where id = p_team_id and active;
  if not found then
    raise exception 'team % is not available for voting', p_team_id;
  end if;
  insert into vote_log (team_id, rating) values (p_team_id, p_rating);
end;
$$;
