-- IFS exhibitor at space 131 (Payton, Nov 2) and remaining exhibitor logos.
-- Tri-Logic uses the Oilfield Logic logo Payton provided.
insert into teams (name, kind, vote_eligible, slug, scan_code, sort_order, votes, active, booth_number, map_x, map_y)
select 'IFS', 'Exhibitor', false, 'ifs', 'DEP26-' || upper(substr(md5(gen_random_uuid()::text), 1, 8)), 0, 0, true, '131', 0.20058, 0.66849
where not exists (select 1 from teams where booth_number = '131' and active);
update teams set slug = 'ifs-' || id, sort_order = id where name = 'IFS' and slug = 'ifs';
update teams set logo_url = '/team-logos/' || id || '-' || v.f || '.png'
from (values (147,'outback-remote-power'),(148,'tri-logic-services'),(152,'high-sky-childrens-ranch'),(153,'make-a-wish')) v(i,f) where teams.id = v.i;
update teams set logo_url = '/team-logos/' || id || '-ifs.png' where name = 'IFS';
