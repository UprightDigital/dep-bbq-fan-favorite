-- Backfill logos that were added to the shared logo folder after the
-- original 002 migration, and add 6 new cook teams whose logos arrived
-- with no corresponding roster row.

update teams set logo_url = '/team-logos/99-caterpillar.png' where id = 99;
update teams set logo_url = '/team-logos/108-edge-ofs.png' where id = 108;
update teams set logo_url = '/team-logos/32-endurance-lift-solutions.png' where id = 32;
update teams set logo_url = '/team-logos/100-fet.png' where id = 100;
update teams set logo_url = '/team-logos/101-flowco.png' where id = 101;
update teams set logo_url = '/team-logos/102-innio-waukesha-gas-revolution-power-solutions.png' where id = 102;
update teams set logo_url = '/team-logos/103-iron-oak-energy-solutions.png' where id = 103;
update teams set logo_url = '/team-logos/49-j4-oilfield-service-syndicate-supply.png' where id = 49;
update teams set logo_url = '/team-logos/104-profrac-services-llc.png' where id = 104;
update teams set logo_url = '/team-logos/109-sandpile.png' where id = 109;
update teams set logo_url = '/team-logos/76-sandx.png' where id = 76;
update teams set logo_url = '/team-logos/105-slb.png' where id = 105;
update teams set logo_url = '/team-logos/106-target-hospitality.png' where id = 106;
update teams set logo_url = '/team-logos/107-taylor-machine-works.png' where id = 107;
update teams set logo_url = '/team-logos/84-the-e3-company.png' where id = 84;

insert into teams (id, name, logo_url, votes) values
  (110, 'BPX', '/team-logos/110-bpx.png', 0),
  (111, 'Dark Vision', '/team-logos/111-dark-vision.png', 0),
  (112, 'Gulf States', '/team-logos/112-gulf-states.png', 0),
  (113, 'Moffit', '/team-logos/113-moffit.png', 0),
  (114, 'Superior', '/team-logos/114-superior.png', 0),
  (115, 'Wall Street', '/team-logos/115-wall-street.png', 0)
on conflict (id) do nothing;

select setval(pg_get_serial_sequence('teams', 'id'), (select max(id) from teams));
