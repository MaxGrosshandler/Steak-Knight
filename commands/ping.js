const Command = require('./command.js');
class PingCommand extends Command {
  constructor(bot) {
    super('ping', bot);
  }

  async execute(msg) {
    await msg.channel.createMessage('Pong!');
    // so on and so forth
  }
}

module.exports = PingCommand;