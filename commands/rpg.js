const serv = require("../server.js");
let client = serv.client;
module.exports = {
  func: async (msg, args) => {
    if (args[0] == "fight"){
        msg.channel.createMessage("Soon:tm:");
    }
    if (args[0] == "stats"){
        let spoop = [];
        spoop[0] = msg.author.id
        let snark = [];
        snark[0] = msg.author.id
        snark[1] = 1
        snark[2] = 40
        snark[3] = 1
        client.query("SELECT * FROM players where id = $1",spoop).then(result => {
            if (typeof result.rows[0] == "undefined"){
                client.query("INSERT INTO players (id, level, hp, atk ) values ($1, $2, $3, $4)", snark)
                msg.channel.createMessage("You are level 1, have 40 hp, and have an attack of 1d6+1. You haven't done anything yet!")
            }
            else {
                msg.channel.createMessage("You are level "+result.rows[0].level+", have "+result.rows[0].hp+" hp, and have an attack of 1d6+"+result.rows[0].atk)
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
