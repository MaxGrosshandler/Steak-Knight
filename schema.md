Bottles - id varchar (20)
Classes - class_name varchar (30), class_type varchar (30), class_value varchar (10), class_skill varchar (30), player_id varchar(20)
Classlist - as above but with no player_id column
Currency - id varchar (20), money int
Items - item_name varchar (20), item_type varchar (20), item_value varchar (10), player_id varchar (20)
Monsters - monster_name varchar (30), monster_id int, monster_level int, player_id varchar (20), hp int, atk int
Players - player_id varchar(20), player_level int, player_hp int, player_atk int, player_xp in, player_next_level int, player_maxhp int
Shop - item_name varchar (20), item_type varchar (20), item_value varchar(10), cost int