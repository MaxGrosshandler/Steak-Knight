

const Command = require('./command.js');
class BanCommand extends Command {
  constructor(bot) {
    super('ban', bot);
  }
async execute(msg, args) {
   

if (msg.member.permission.has("banMembers")==true){
    bot.banGuildMember(msg.channel.guild.id, msg.mentions[0].id, 0, args.join(" "))
}


  }
}

module.exports = BanCommand;