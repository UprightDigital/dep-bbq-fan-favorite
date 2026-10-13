-- Add three cook teams listed on the Cvent Map page (Oct 13).
insert into teams (id, name, kind, vote_eligible, slug, scan_code, sort_order, votes, active, booth_number)
select v.id, v.name, 'Cooking', true, v.slug || '-' || v.id,
       'DEP26-' || upper(substr(md5(gen_random_uuid()::text), 1, 8)), v.id, 0, true, v.space
from (values
  (138, 'Texas Pacific Water', 'texas-pacific-water', '130'),
  (139, 'Weatherford',         'weatherford',         '1107'),
  (140, 'NexTier',             'nextier',             '800')
) v(id, name, slug, space)
on conflict (id) do nothing;

select setval('teams_id_seq', (select max(id) from teams));

update teams set logo_url = '/team-logos/139-weatherford.png' where id = 139;
update teams set logo_url = '/team-logos/140-nextier.png'     where id = 140;

-- From the event map (Oct 13): J&W Services and Solnexus share space 354 as
-- one entry; Natural Gas Services Group is space 869.
update teams set name = 'J&W Services & Solnexus', booth_number = '354' where id = 48;
update teams set active = false, booth_number = '354' where id = 137;
update teams set booth_number = '869' where id = 136;
