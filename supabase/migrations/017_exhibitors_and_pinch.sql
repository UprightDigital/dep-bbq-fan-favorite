-- Exhibitor hospitality tents from the Cvent map (10.12), spaces 101-119,
-- plus new cook team Pinch Transportation (space TBD). Oct 31.
insert into teams (id, name, kind, vote_eligible, slug, scan_code, sort_order, votes, active, booth_number)
select v.id, v.name, v.kind, v.kind = 'Cooking', v.slug || '-' || v.id,
       'DEP26-' || upper(substr(md5(gen_random_uuid()::text), 1, 8)), v.id, 0, true, v.space
from (values
  (142, 'RigER',                      'Hospitality', 'riger',                      '101'),
  (143, 'Industrial Diesel',          'Hospitality', 'industrial-diesel',          '103'),
  (144, 'Viotas',                     'Hospitality', 'viotas',                     '105'),
  (145, 'Centrium Energy Solutions',  'Hospitality', 'centrium-energy-solutions',  '107'),
  (146, 'Wanner Pumps',               'Hospitality', 'wanner-pumps',               '109'),
  (147, 'Outback Remote Power',       'Hospitality', 'outback-remote-power',       '111'),
  (148, 'Tri-Logic',                  'Hospitality', 'tri-logic',                  '113'),
  (149, 'Spira Data',                 'Hospitality', 'spira-data',                 '115'),
  (150, 'John Deere Power Systems',   'Hospitality', 'john-deere-power-systems',   '119'),
  (151, 'Pinch Transportation',       'Cooking',     'pinch-transportation',       null)
) v(id, name, kind, slug, space)
on conflict (id) do nothing;

select setval('teams_id_seq', (select max(id) from teams));
