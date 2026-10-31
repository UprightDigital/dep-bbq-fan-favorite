-- Exhibitors are their own type (not cook team, not hospitality). They behave
-- like hospitality tents (passport stamps, no Fan Favorite) but are labeled
-- "Exhibitor". Names per Payton, Oct 31.
update teams set name = 'Spira Software'      where id = 149;
update teams set name = 'Tri-Logic Services'  where id = 148;
update teams set name = 'VIOTAS'              where id = 144;
update teams set name = 'Wanner Engineering'  where id = 146;
update teams set name = 'DNOW Inc.'           where id = 25;

update teams set kind = 'Exhibitor', vote_eligible = false
 where id in (142, 143, 144, 145, 146, 147, 148, 149, 150, 25, 136);

-- NGS stays hospitality (Oct 31 correction).
update teams set kind = 'Hospitality' where id = 136;
