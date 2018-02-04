var Raven = require('raven');
const config = require("./config.json");
Raven.config('https://10cedb5c913647ff82c39805f60ff3a0:597b61d426aa4312857e22dca9bde566@sentry.io/277301').install();
class Command {
  constructor(name, bot) {
    this.name = name;
    this.bot = bot;
    this.bot.registerCommand(this.name, this.execute.bind(this));
    this.config = config;
  }

  async execute(msg) {
    // no-op
  }
}

module.exports = Command;