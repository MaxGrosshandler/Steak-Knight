const serv = require("../server.js");
let client = serv.client;
let bot = serv.bot;
module.exports = {
  func: async (msg, args) => {
      let command = args[0]
    // ping
    if (command = null){
        msg.channel.createMessage("You are a sleuth indeed!")
    }
    if (command = 'hint'){
        let exists = await client.query ("Select from bottles where id = $1", [msg.author.id])
    }
},
  options: {
    description: "Solve a mystery!",
    fullDescription: "`pink panther theme intensifies`",
    usage: "`sk sleuth`"
  },
  name: "sleuth"
};
