
const Command = require('./command.js');
class RoleCommand extends Command {
  constructor(bot) {
    super('role', bot);
  }
async execute(msg, args) {
    for (var [key, value] of msg.channel.guild.roles) {
        if (args[1] == msg.channel.guild.roles.get(key).name)
            try {
                msg.channel.guild.addGuildMemberRole(msg.channel.guild.id, msg.mentions[0].id, (msg.channel.guild.roles.get(key).id));
            }
        catch (Error) {
            msg.channel.createMessage("Something went wrong! I probably don't have permission to do this!")
        }

    }


  }
}

module.exports = RoleCommand;