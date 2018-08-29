const serv = require("../server.js");
let client = serv.client;
let bot = serv.bot;
let weebSH = serv.weebSH;
module.exports = {
  func: async (msg, args) => {
    if (
      msg.author.id == "195156669108322313" ||
      msg.author.id == "107563269484490752" ||
      msg.member.permission.has("banMembers") == true
    ) {
      if (args[0] == "") {
        msg.channel.createMessage("You need to have a prefix!");
        return;
      }
      if (args[0] == "reset") {
        weebSH.tama.updateSetting({type: 'guilds', id: msg.channel.guild.id, data: {prefix: "sk "}})
        .then(msg.channel.createMessage("Prefixes have been reset."))
        .catch(console.error)
        return;
      }
      weebSH.tama.updateSetting({type: 'guilds', id: msg.channel.guild.id, data: {prefix: args[0]}})
        .then(array => {
          //console.log(array)
        msg.channel.createMessage("Your new prefix is " + args[0])
    }
    )
        .catch(console.error)
          
          } else {
      msg.channel.createMessage("You don't got permissions!");
    }
  },
  options: {
    description: "Prefix management",
    fullDescription: "Set or reset a custom prefix",
    usage: "`sk prefix customprefix` and `customprefix reset`"
  },
  name: "prefix"
};
