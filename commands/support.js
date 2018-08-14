module.exports = {
  func: async (msg, args) => {
    msg.channel.createMessage(
      "My support server can be found at https://discord.gg/4Bk8JZs"
    );
  },
  options: {
    description: "Get support!",
    fullDescription: "Provides an invite to the bot's support server",
    usage: "`sk support`"
  },
  name: "support"
};
