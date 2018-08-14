module.exports = {
  func: async (msg, args) => {
    for (var [key, value] of msg.channel.guild.roles) {
      if (args[1] == msg.channel.guild.roles.get(key).name)
        // gives a role
        try {
          msg.channel.guild.addGuildMemberRole(
            msg.channel.guild.id,
            msg.mentions[0].id,
            msg.channel.guild.roles.get(key).id
          );
        } catch (Error) {
          msg.channel.createMessage(
            "Something went wrong! I probably don't have permission to do this!"
          );
        }
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
