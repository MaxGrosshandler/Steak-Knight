const Command = require('./command.js');
class PingCommand extends Command {
  constructor(bot) {
    super('ping', bot);
  }

  async execute(msg) {
    await msg.channel.createMessage('Pong!').then(m => {
        let time = m.timestamp - msg.timestamp;
        return m.edit(`Pong! **${time}**ms`);
    });
}
    // so on and so forth
  }

module.exports = PingCommand;