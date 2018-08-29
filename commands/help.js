const serv = require("../server.js")
const helpCommands = serv.helpCommands;
module.exports = {
  func: async (msg,args) => {
      let str = "";
    if (typeof args[0] == "undefined") {
        helpCommands.forEach(cmd => {
            str += "sk " + cmd[0] + " - " + cmd[1] + "\n";
        });
        str += "Use `sk help <command>` for more detailed information.";
        msg.channel.createMessage({
            embed: {
                description: str,
                title: "My help command"
            }
        });
        str = "";
    } else if (typeof args[0] !== "undefined") {
        let cmd;
        helpCommands.forEach(c => {
            if (c[0] == args[0]) {
                cmd = c;
                return;
            }
        });
        if (typeof cmd !== "undefined") {
            msg.channel.createMessage({
                embed: {
                    title: "**" + cmd[0] + "**",
                    description: cmd[2] + "\n" + cmd[3]
                }
            });
        }
    }
},
  options: {
    description: "help!",
    fullDescription: "gives help!",
    usage: "`sk help`"
  },
  name: "help"
};
