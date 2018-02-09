





const Command = require('./command.js');
class SupportCommand extends Command {
  constructor(bot) {
    super('support', bot);
  }
async execute(msg, args) {
  msg.channel.createMessage("My support server can be found at https://discord.gg/4Bk8JZs")
  }
}

module.exports = SupportCommand;