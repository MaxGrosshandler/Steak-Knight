const serv = require("../server.js");
let client = serv.client;
let droll = serv.droll;
module.exports = {
  func: async (msg, args) => {
    if (args[0] == "find"){
        let spoop = [];
        spoop[0] = msg.author.id
        let snark = [];
        client.query("Select * from players where id= $1",spoop).then(p => {
            if (p.rows[0].level < 3){
                snark[0] = "Steakgoblin"
            }
            else{
                snark[0] = "Steakorc"
            }
        
        snark[1] = 1234
        snark[2] = Math.ceil(p.rows[0].level / 2)
        snark[3] = msg.author.id
        snark[4] = 10 + 5 * Math.ceil(p.rows[0].level / 2)
        snark[5] = 1  * Math.ceil(p.rows[0].level / 2)
        })
       
        
        
        client.query("SELECT * FROM monsters where player_id = $1",spoop).then(result => {
            if (typeof result.rows[0] == "undefined"){
                client.query("INSERT INTO monsters (monster_name, monster_id, monster_level, player_id, hp,  atk ) values ($1, $2, $3, $4, $5, $6)", snark)
                msg.channel.createMessage({embed:{description:"You found a "+snark[0] +"! It is level "+snark[2]+", has " + snark[4]+ " health, and has an attack of 1d3+" + snark[5]+ "."}})
            }
            else {
                client.query("SELECT * FROM monsters where player_id = $1",spoop).then(result => {
                msg.channel.createMessage({embed:{description:"You are currently fighting a level "
                +result.rows[0].monster_level+ " " + result.rows[0].monster_name +
                 " with " +result.rows[0].hp+" hp, and  an attack of 1d3+"+result.rows[0].atk+"."}})
            })
            }
        
        })
    }

    if (args[0] == "fight"){
        client.query("SELECT * FROM monsters where player_id = $1",[msg.author.id]).then(monster=> {
            if (typeof monster.rows[0] == "undefined"){
                msg.channel.createMessage({embed:{description:"You haven't found a monster yet! Use `sk rpg find`"}})
            }
            else {
                client.query("SELECT * FROM players where id = $1",[msg.author.id]).then(player =>
                     {
                let playerHit = droll.roll(`1d6+${player.rows[0].atk}`).total;
                let monsterHit = droll.roll(`1d3+${monster.rows[0].atk}`).total;
                let atkDesc = "You dealt the monster " + playerHit + " damage!\n"+
                "The monster dealt you " + monsterHit + " damage!"
                if ( 0 >= monster.rows[0].hp - playerHit){
                    atkDesc = "You killed the monster! Hooray! You gained " + monster.rows[0].monster_level * 20 + " xp!"
                    client.query("DELETE FROM monsters where player_id = $1",[player.rows[0].id]);
                    if (player.rows[0].xp + monster.rows[0].monster_level*20 >= player.rows[0].next_level){
                        client.query("UPDATE players SET (xp, hp, atk, level, next_level, maxhp) = (players.xp + $1, players.maxhp + 10 , players.atk + 1, players.level+1, players.next_level + 100, players.maxhp+10)   where id = $2", [monster.rows[0].monster_level * 20, player.rows[0].id]);
                   atkDesc += "\nAlso, you leveled up! You are now level " + (player.rows[0].level + 1)
                    }
                    else{
                        client.query("UPDATE players SET xp = players.xp + $1 where id = $2", [monster.rows[0].monster_level * 20, player.rows[0].id]);
                    }
                }
                else if (0 >= player.rows[0].hp - monsterHit){
                    atkDesc = "Oh no, you were killed by the monster! You'll have to find another one to fight!"
                    client.query("DELETE FROM monsters  where player_id = $1", [player.rows[0].id]);
                    client.query("UPDATE players SET hp = $1 where id = $2", [player.rows[0].maxhp, player.rows[0].id]);
                }
                else {
                    client.query("UPDATE players SET hp = players.hp - $1 where id = $2",[monsterHit, player.rows[0].id]);
                    client.query("UPDATE monsters SET hp = monsters.hp - $1 where player_id = $2",[playerHit, player.rows[0].id]);
                }
                

                
                msg.channel.createMessage(
                                {
                                 embed:
                                        {
                                    description: atkDesc
                                        }
                                })
                
                


                        })
                }

        })

    }
    if (args[0] == "help"){
        msg.channel.createMessage({embed:{description:"You can use `sk rpg` to check your stats, `sk rpg find` to find a monster to fight, and `sk rpg fight` to fight a monster! Please use `sk rpg` first!"}});
    }
    if (args[0] == null){
        let spoop = [];
        spoop[0] = msg.author.id
        let snark = [];
        snark[0] = msg.author.id
        snark[1] = 1
        snark[2] = 50
        snark[3] = 1
        snark[4] = 0
        snark[5] = 100
        snark[6] = 50
        client.query("SELECT * FROM players where id = $1",spoop).then(result => {
            if (typeof result.rows[0] == "undefined"){
                client.query("INSERT INTO players (id, level, hp, atk, xp, next_level, maxHP) values ($1, $2, $3, $4, $5, $6, $7)", snark)
                msg.channel.createMessage({embed:{description:"You are level 1, have 50 hp, and have an attack of 1d6+1. You haven't done anything yet, so you have 0xp."}})
            }
            else {
                msg.channel.createMessage({embed:{description:"You are level "+result.rows[0].level+", have "+result.rows[0].hp+" out of " +result.rows[0].maxhp + " hp, and have an attack of 1d6+"+result.rows[0].atk + ".\n"
                +"You have " + result.rows[0].xp + " xp and you hit the next level at " +result.rows[0].next_level + " xp."}})
            }
        })
    }
   
},
  options: {
    description: "Rpg system (in development)!",
    fullDescription: "You can use `sk rpg` to check your stats, `sk rpg find` to find a monster to fight, and `sk rpg fight` to fight a monster! Please use `sk rpg` first!",
    usage: "`sk rpg`"
  },
  name: "rpg"
};
