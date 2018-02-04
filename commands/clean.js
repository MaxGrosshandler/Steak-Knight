


const Command = require('./command.js');
class CleanCommand extends Command {
  constructor(bot) {
    super('clean', bot);
  }
async execute(msg, args) {
   if ((msg.author.id == this.config.owner) || (msg.member.permission.has("banMembers") == true))
        msg.channel.getMessages(parseInt(args[0] + 1)).then(m => {
            for (let message of m) {
                if (message.author.id == this.bot.user.id) {
                    message.channel.deleteMessage(message.id);
                }
            }
        });
  }
}

module.exports = CleanCommand;