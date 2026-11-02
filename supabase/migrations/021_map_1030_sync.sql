-- Sync booth numbers and map pins to the 10.30 map (Nov 2).
update teams set booth_number='129' where id=150; -- John Deere
update teams set booth_number='133' where id=69;  -- Precision Power Cleaning & Primo
update teams set booth_number='124' where id=111; -- DarkVision
update teams set booth_number='154' where id=112; -- Gulf States
update teams set booth_number='144' where id=113; -- Moffitt
update teams t set map_x=v.x, map_y=v.y from (values
(69,0.18313,0.63769),(111,0.18063,0.71856),(135,0.1335,0.5456),(115,0.13075,0.42034),(141,0.31825,0.388),(53,0.74644,0.66792),
(79,0.85686,0.76888),(30,0.87471,0.73313),(139,0.84348,0.80138),(128,0.83456,0.8225),(122,0.82297,0.84038),(119,0.81226,0.85663),(136,0.781,0.398)
) v(id,x,y) where t.id=v.id;
