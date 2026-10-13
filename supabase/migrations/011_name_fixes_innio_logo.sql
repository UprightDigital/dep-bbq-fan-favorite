-- Name fixes (Oct 13) and combined INNIO / Waukesha / Jenbacher /
-- Revolution Power Solutions logo.
update teams t set name = v.name
from (values
  (2,  'AMGAS'),
  (25, 'DNOW'),
  (33, 'Enquest, Deroode, Lockton, Old Smokey')
) v(id, name)
where t.id = v.id;

update teams set logo_url = '/team-logos/102-innio-waukesha-jenbacher-revolution.png' where id = 102;
