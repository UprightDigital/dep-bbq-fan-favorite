-- Timpte hospitality tent at space 130 (Payton, Nov 2).
insert into teams (name, kind, vote_eligible, slug, scan_code, sort_order, votes, active, booth_number, map_x, map_y)
select 'Timpte','Hospitality',false,'timpte','DEP26-' || upper(substr(md5(gen_random_uuid()::text),1,8)),0,0,true,'130',0.16125,0.68439
where not exists (select 1 from teams where name='Timpte');
update teams set slug='timpte-'||id, sort_order=id where name='Timpte' and slug='timpte';
