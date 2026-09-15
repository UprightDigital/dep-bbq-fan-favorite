-- Fix a bug: 4 teams had logo_url values pointing at /sponsor-logos/...,
-- a folder that was never part of this app's public/ directory, so those
-- images were 404ing on the live site. KLX's actual logo file has been
-- added under /team-logos/; the other 3 are nulled out until a real logo
-- file is available for them (a missing logo renders nothing, which is
-- safer than a broken image).

update teams set logo_url = '/team-logos/127-klx-energy-services-wolfpack.png' where id = 127;
update teams set logo_url = null where id in (27, 125, 134);
