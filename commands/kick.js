
const Command = require('./command.js');
class kickCommand extends Command {
  constructor(bot) {
    super('kick', bot);
  }
async execute(msg, args) {
  if (msg.member.permission.has("kickMembers")==true){
        try {
        bot.kickGuildMember(msg.channel.guild.id,msg.mentions[0].id,args.join(" "))

        }
        catch (error){
            msg.channel.createMessage("That didn't work!")
        }
    }
}
    // so on and so forth
  }


module.exports = kickCommand;