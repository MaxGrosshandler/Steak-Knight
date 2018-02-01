class Command {
  constructor(name, bot) {
    this.name = name;
    this.bot = bot;
    this.bot.registerCommand(this.name, this.execute.bind(this));
  }

  async execute(msg) {
    // no-op
  }
}

module.exports = Command;