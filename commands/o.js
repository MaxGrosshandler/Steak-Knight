const serv = require("../server.js");
let client = serv.client;
const config = require("../config.json")
let bot = serv.bot;
async function createItem(vals){
    client.query("insert into shop (item_name, item_type, item_value, cost) values ($1, $2, $3, $4)", [vals[0], vals[1], vals[2], vals [3]]);
}
async function giveItem(name, id){
    let item = await client.query("SELECT * FROM shop where item_name = $1",[name]).then(s => {
        return s.rows[0];
    })
    client.query("INSERT INTO items (item_name, item_type, item_value, player_id) values ($1, $2, $3, $4)", [item.item_name, item.item_type, item.item_value, id])
}
async function getPlayer(id) {
    return client.query("SELECT * FROM players where player_id = $1", [id]).then(p => {
        return p.rows[0];
    })
}
async function heal(player, value) {
    client.query("Update players set player_hp = players.player_hp + $1 where player_id = $2", [value, player.player_id])
    let person = await getPlayer(player.player_id)
    if(person.player_hp > person.player_maxhp){
        client.query("Update players set player_hp = players.player_maxhp where player_id = $1", [person.player_id])
    }
}
module.exports = {
  func: async (msg, args) => {
    if (config.ids.includes(msg.author.id)){
        let c = args[0]
        args.shift()
        if (c == "ci") {
            createItem(args)
        }
        if (c == "gi"){
            let id = args[1].replace(/[^a-zA-Z0-9]/g, '');
            giveItem(args[0], id)
        }
        if (c == "heal") {
            let id = args[0].replace(/[^a-zA-Z0-9]/g, '');
            let player = await getPlayer(id)
            if (typeof player !== "undefined") {
                    let user = await bot.getRESTUser(id).then(user => {
                    return user})
                    if(!isNaN(args[1])){
                    heal(player, Math.abs(args[1]))
                    msg.channel.createMessage("You healed " +user.username + " for " + args[1] + " hp!")
                    }
                    else{
                        msg.channel.createMessage("That's not a valid number to heal!")
                    }
            }
            else {
                msg.channel.createMessage("That player doesn't exist!")
            }
        } 
    }
},
  options: {
    description: "Owner only command",
    fullDescription: "Do cool things with it",
    usage: "`sk o <stuff>`"
  },
  name: "o"
};
