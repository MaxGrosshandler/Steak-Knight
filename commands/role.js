const server = require("../server.js");
const bot = server.bot;
module.exports = {
  func: async (msg, args) => {
    if (msg.member.permission.has("banMembers")){
    for (var [key, value] of msg.channel.guild.roles) {
      if (args[1] == msg.channel.guild.roles.get(key).name) 
        try {
          bot.addGuildMemberRole(
            msg.channel.guild.id,
            args[2].replace(/[^a-zA-Z0-9]/g, ''),
            msg.channel.guild.roles.get(key).id
          );
          return;
        } catch (Error) {
          msg.channel.createMessage(
            "Something went wrong! I probably don't have permission to add that role!"
          );
        }
    }
  }
  else{ 
    msg.channel.createMessage("You don't got perms son")
  }
},
  options: {
    description: "Gives a user a role!",
    fullDescription:
      "Gives a user a role. Make sure the bot has the needed perms.",
    usage: "`sk role @user <rolename>`"
  },
  name: "role"
};
