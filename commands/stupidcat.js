const serv = require("../server.js");
const bot = serv.bot;
module.exports = {
  func: async (msg, args) => {
    msg.channel.createMessage(`stupid cat is a cute little ball of fur`);
  },

  options: {
    description: "Tells you about stupid cat",
    fullDescription: "Tells you about stupid cat",
    usage: "`sk stupidcat`"
  },
  name: "stupidcat"
};
