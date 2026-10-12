-- Sync the roster to the master list ("All teams and Hospitality", Oct 12):
-- 111 cook teams + 22 hospitality tents.
-- Teams no longer on the list are hidden (active = false), not deleted, so
-- their locked QR scan codes survive and they can be switched back on.

-- Renames
update teams t set name = v.name
from (values
  (85,  'University Lands & UTPB'),
  (93,  'Verde (VTX Energy Partners)'),
  (111, 'DarkVision Technologies'),
  (114, 'Superior Energy Services'),
  (115, 'Wallstreet Sand')
) v(id, name)
where t.id = v.id;

-- New teams (scan codes are generated once and then locked by migration 008)
insert into teams (id, name, kind, vote_eligible, slug, scan_code, sort_order, votes, active)
select v.id, v.name, v.kind, v.kind = 'Cooking', v.slug || '-' || v.id,
       'DEP26-' || upper(substr(md5(gen_random_uuid()::text), 1, 8)), v.id, 0, true
from (values
  (135, 'Eminent Oilfield Services',        'Cooking',     'eminent-oilfield-services'),
  (136, 'Natural Gas Services Group, Inc.', 'Hospitality', 'natural-gas-services-group-inc'),
  (137, 'Solnexus Chemical / AgriEmpres',   'Hospitality', 'solnexus-chemical-agriempres')
) v(id, name, kind, slug)
on conflict (id) do nothing;

select setval('teams_id_seq', (select max(id) from teams));

-- Not on the master list: hide
update teams set active = false where id in (
  80,  -- Smart Chemical Services
  131, -- Merit Advisors
  134  -- Weaver, Banc of California & Polk Capital
);

-- Logos
update teams t set logo_url = v.logo_url
from (values
  (27,  '/team-logos/27-downhole-chemical-solutions.png'),
  (85,  '/team-logos/85-university-lands-utpb.png'),
  (93,  '/team-logos/93-verde-vtx-energy-partners.png'),
  (125, '/team-logos/125-rolls-royce-solutions-america.png'),
  (135, '/team-logos/135-eminent-oilfield-services.png'),
  (136, '/team-logos/136-natural-gas-services-group.png')
) v(id, logo_url)
where t.id = v.id;

-- Hidden teams can't receive ratings
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

  update teams set votes = votes + p_rating where id = p_team_id and active;
  if not found then
    raise exception 'team % is not available for voting', p_team_id;
  end if;
  insert into vote_log (team_id, rating) values (p_team_id, p_rating);
end;
$$;
