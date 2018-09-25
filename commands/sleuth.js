const serv = require("../server.js");
let client = serv.client;
async function getPlayerClue (id) {
    return client.query("SELECT * from player_clues where player_id = $1", [id]).then(p => {
        return p.rows[0];
    })
}
module.exports = {
  func: async (msg, args) => {
      let command = args[0]
      let playerClue = await getPlayerClue(msg.author.id)
    // ping
    if (command == null){
        msg.channel.createMessage("You are a sleuth indeed!")
    }
    if (command == 'hint'){
        
        if (typeof playerClue !== "undefined"){
            msg.channel.createMessage(playerClue.clue_hint)
        }
        else {
            msg.channel.createMessage("You are no detective!")
        }
    }
    if (command == 'solve'){
        if (typeof playerClue !== "undefined"){
            if (playerClue.clue_solution == args[1]){
                msg.channel.createMessage("You've cracked the case!")
            }
            else {
                msg.channel.createMessage("You need more evidence!")
            }
        }
        else {
            msg.channel.createMessage("You have nothing to solve!")
        }
    }
},
  options: {
    description: "Solve a mystery!",
    fullDescription: "`pink panther theme intensifies`",
    usage: "`sk sleuth`"
  },
  name: "sleuth"
};
