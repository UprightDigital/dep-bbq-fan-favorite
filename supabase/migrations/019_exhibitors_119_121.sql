-- Per 10.30 map (Payton, Nov 2): John Deere is space 123; Make-A-Wish (119)
-- and High Sky Children's Ranch (121) added as exhibitors.
update teams set booth_number = '123' where id = 150;

insert into teams (name, kind, vote_eligible, slug, scan_code, sort_order, votes, active, booth_number, map_x, map_y)
select v.name, 'Exhibitor', false, v.slug,
       'DEP26-' || upper(substr(md5(gen_random_uuid()::text), 1, 8)), 0, 0, true, v.space, v.x, v.y
from (values
  ('Make-A-Wish',               'make-a-wish',               '119', 0.22687::real, 0.72667::real),
  ('High Sky Children''s Ranch', 'high-sky-childrens-ranch',  '121', 0.22155::real, 0.71699::real)
) v(name, slug, space, x, y)
where not exists (select 1 from teams t where t.booth_number = v.space and t.active);

update teams set slug = slug || '-' || id, sort_order = id
 where booth_number in ('119','121') and kind = 'Exhibitor' and slug not like '%-' || id;
