-- Patterson-UTI and NexTier compete as one team (space 800).
update teams set name = 'Patterson-UTI & NexTier',
  logo_url = '/team-logos/63-patterson-uti-nextier.png' where id = 63;
-- NexTier's printed QR code keeps working: it forwards to the combined team.
update teams set active = false, qr_target = '/vote/63' where id = 140;
-- Spell out United Vision Logistics.
update teams set name = 'Mustang Cat / United Vision Logistics' where id = 57;
