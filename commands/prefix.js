const serv = require("../server.js");
let client = serv.client;
let bot = serv.bot;
module.exports = {
  func: async (msg, args) => {
    if (
      msg.author.id == "195156669108322313" ||
      msg.author.id == "107563269484490752" ||
      msg.member.permission.has("banMembers") == true
    ) {
      const text = "INSERT INTO prefixes(id, list) VALUES($1, $2) RETURNING *";
      const values = [msg.channel.guild.id, args[0]];
      if (args[0] == "") {
        msg.channel.createMessage("You need to have a prefix!");
        return;
      }
      if (args[0] == "reset") {
        const delText = "DELETE FROM prefixes WHERE ID = $1";
        const delVals = [values[0]];
        client
          .query(delText, delVals)
          .then(res => {
            bot.registerGuildPrefix(msg.channel.guild.id, ["sk ", "Sk "]);
            msg.channel.createMessage("Your prefix has been reset.");
          })
          .catch(e => console.error(e.stack));
        return;
      }
      client
        .query(text, values)
        .then(res => {
          bot.registerGuildPrefix(msg.channel.guild.id, args[0]);
          msg.channel.createMessage("Your new prefix is " + args[0]);
        })
        .catch(e => console.error(e.stack));
    } else {
      msg.channel.createMessage("You don't got perms!");
    }
  },
  options: {
    description: "Prefix management",
    fullDescription: "Set or reset a custom prefix",
    usage: "`sk prefix customprefix` and `customprefix reset`"
  },
  name: "prefix"
};
