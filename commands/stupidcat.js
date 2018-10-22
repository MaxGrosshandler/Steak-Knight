const serv = require("../server.js");
const bot = serv.bot;
module.exports = {
  func: async (msg, args) => {
    await msg.channel.createMessage("Pong!").then(m => {
      return m.edit(`stupid cat is an adorable and cute ball of fur`);
    });
  },

  options: {
    description: "Tells you about stupid cat",
    fullDescription: "Tells you about stupid cat",
    usage: "`sk stupidcat`"
  },
  name: "stupidcat"
};
