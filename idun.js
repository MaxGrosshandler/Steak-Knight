const serv = require("./server.js");
module.exports = {
  send: async (msg, args) => {
    let bot = serv.bot;
    let perms = msg.channel.permissionsOf(bot.user.id).json;
            if (perms.readMessages && perms.sendMessages) {
              msg.channel.createMessage(args)
            }
            else {
              console.log("I'm muted in that channel!")
            }
},

  name: "idun"
};
