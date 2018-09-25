# Steak-Knight Database Schema

Note from Cat: this needs to be normalized :notlikethis:. Additionally, user IDs can be longer than 20 characters.

## Bottles
```sql
-- note from cat: should be renamed to Bottle
CREATE TABLE Bottles (
  id VARCHAR(20) PRIMARY KEY
)
```

## Players

```sql
-- note from cat: should be renamed to Player, should reference a centralized User table
CREATE TABLE Players (
  player_id VARCHAR(20) PRIMARY KEY,
  player_level INT,
  player_hp INT,
  player_atk INT,
  player_xp INT,
  player_next_level INT,
  player_maxhp INT
)
```

## Classes

```sql
-- note from cat: should not include class information, should be renamed to PlayerClass
CREATE TABLE Classes (
  class_name VARCHAR(30),
  player_id VARCHAR(20) FOREIGN KEY REFERENCES Players(player_id),
  class_type VARCHAR(30),
  class_value VARCHAR(10),
  class_skill VARCHAR(30),
  PRIMARY KEY (class_name, player_id)
)
```

## Classlist
```sql
-- note from cat: should be renamed to Class
CREATE TABLE Classlist (
  class_name VARCHAR(30) PRIMARY KEY,
  class_type VARCHAR(30),
  class_value VARCHAR(10),
  class_skill VARCHAR(30),
)
```

## Currency
```sql
-- note from cat: should be included in a centralized User table
CREATE TABLE Currency (
  id VARCHAR(20) PRIMARY KEY,
  money INT
)
```

## Shop
```sql
-- note from cat: Should be renamed to Item
CREATE TABLE Shop (
  item_name VARCHAR(20) PRIMARY KEY,
  item_type VARCHAR(20),
  item_value VARCHAR(10),
  cost INT
)
```

## Items
```sql
-- note from cat: should be renamed to PlayerItem, should only contain player association
CREATE TABLE Items (
  item_name VARCHAR(20),
  player_id VARCHAR(20) FOREIGN KEY REFERENCES Players(player_id)
  item_type VARCHAR(20),
  item_value VARCHAR(10),
  PRIMARY KEY (item_name, player_id)
)
```

## Monsters
```sql
-- note from cat: should be renamed to Monster, should only contain monster information, should extract association with player to new table
CREATE TABLE Monsters (
  monster_name VARCHAR(30),
  player_id VARCHAR(20) FOREIGN KEY REFERENCES Players(player_id),
  monster_id INT,
  monster_level INT,
  hp INT,
  atk INT,
  PRIMARY KEY(monster_name, player_id)
)
```

Some notes: these are not all the tables I use, just the relevant ones. Additionally, monster_id serves no purpose rn
