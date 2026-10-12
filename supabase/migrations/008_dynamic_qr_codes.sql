-- Dynamic QR codes.
--
-- Every printed QR code encodes https://dep-bbq-fan-favorite.vercel.app/q/{scan_code}.
-- The /q route looks the scan code up at scan time and redirects, so a team's
-- name, logo, id or destination can change later without reprinting anything.
--
-- 1. qr_target: optional per-team override for where that team's code points.
--    Leave NULL to use the default (/vote/{id}). Accepts a site path such as
--    "/leaderboard" or a full https:// URL.
-- 2. scan_code is printed on physical QR codes, so it is locked: any attempt
--    to change it raises an error.

alter table teams add column if not exists qr_target text;

comment on column teams.qr_target is
  'Optional override for where this team''s printed QR code points. NULL = /vote/{id}. A path like /leaderboard or a full https:// URL.';

comment on column teams.scan_code is
  'Permanent code printed on this team''s QR code. Locked: cannot be changed.';

create or replace function lock_scan_code()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.scan_code is distinct from old.scan_code then
    raise exception 'scan_code % is printed on a QR code and cannot be changed', old.scan_code;
  end if;
  return new;
end;
$$;

drop trigger if exists teams_lock_scan_code on teams;
create trigger teams_lock_scan_code
  before update of scan_code on teams
  for each row execute function lock_scan_code();
