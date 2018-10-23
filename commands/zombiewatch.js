const serv = require("../server.js");
const bot = serv.bot;
let alexia = "cute";
const config = require("../config.json")
module.exports = {
  func: async (msg, args) => {
   if ( config.ids.includes(msg.author.id)
 
    ) {
      msg.channel.createMessage(`Hello, my name is 0x${bot.zombieWatch.color}!`);
    }
  },

  options: {
    description: "Zombie Watch name checker",
    fullDescription: "Checks the name of the current zombiewatcher",
    usage: "`sk zombiewatch`"
  },
  name: "zombiewatch"
};
