const serv = require("../server.js");
const bot = serv.bot;
const config = require("../config.json")
module.exports = {
  func: async (msg, args) => {
    if (config.ids.includes(msg.author.id)

    ) {
      let toExecute;
      let code = args.join(" ");
      if (code == "config.token") code = "\"nah, fam\""
      if (code.split("\n").length === 1)
        toExecute = eval(`async () => ${code}`);
      else toExecute = eval(`async () => { ${code} }`);
      toExecute.bind(this);
      try {
        msg.channel.createMessage(await toExecute());
      } catch (err) {
        msg.channel.createMessage(err.stack);
      }
    }
  },

  options: {
    description: "Owner-only eval",
    fullDescription: "You don't get to use this unless you're me",
    usage: "`sk eval`"
  },
  name: "eval"
};
