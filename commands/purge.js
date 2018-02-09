




const Command = require('./command.js');
class PurgeCommand extends Command {
  constructor(bot) {
    super('purge', bot);
  }
async execute(msg, args) {
  
    if ((msg.author.id == config.owner) || (msg.member.permission.has("banMembers") == true))
        msg.channel.purge(parseInt(args[0]) + 2)


    // so on and so forth
}
}
module.exports = PurgeCommand;