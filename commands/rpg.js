const serv = require("../server.js");
let client = serv.client;
module.exports = {
  func: async (msg, args) => {
    if (args[0] == "fight"){
        let spoop = [];
        spoop[0] = msg.author.id
        let snark = [];
        snark[0] = msg.author.id
        snark[1] = 1
        snark[2] = 40
        snark[3] = 1
        
        client.query("SELECT * FROM monsters where player_id = $1",spoop).then(result => {
            if (typeof result.rows[0] == "undefined"){
                client.query("INSERT INTO monsters (monster_name, monster_id, monster_level,  atk ) values ($1, $2, $3, $4)", snark)
                msg.channel.createMessage({embed:{description:"You found a Steakface! It is level 1, has 10 health, and has an attack of 1d3+1."}})
            }
            else {
                msg.channel.createMessage({embed:{description:"You are currently fighting a level "+result.rows[0].level+ " " + result.rows[0].monster_name + " with " +result.rows[0].hp+" hp, and  an attack of 1d3+"+result.rows[0].atk}})
            }
        })
    }
    if (args[0] == null){
        let spoop = [];
        spoop[0] = msg.author.id
        let snark = [];
        snark[0] = msg.author.id
        snark[1] = 1
        snark[2] = 40
        snark[3] = 1
        snark[4] = 0
        snark[5] = 100
        client.query("SELECT * FROM players where id = $1",spoop).then(result => {
            if (typeof result.rows[0] == "undefined"){
                client.query("INSERT INTO players (id, level, hp, atk ) values ($1, $2, $3, $4, $5, $6 )", snark)
                msg.channel.createMessage({embed:{description:"You are level 1, have 40 hp, and have an attack of 1d6+1. You haven't done anything yet, so you have 0xp."}})
            }
            else {
                msg.channel.createMessage({embed:{description:"You are level "+result.rows[0].level+", have "+result.rows[0].hp+" hp, and have an attack of 1d6+"+result.rows[0].atk + ".\n"
                +"You have " + result.rows[0].xp + " xp and you hit the next level at " +result.rows[0].next_level + " xp."}})
            }
        })
    }
   
},
  options: {
    description: "Rpg system (in development)!",
    fullDescription: "Currently still in development, check back soon!",
    usage: "`sk rpg`"
  },
  name: "rpg"
};
