module.exports = {
  func: async (msg, args) => {
    msg.channel.createMessage(
      "Invite me with **<https://bot.discord.io/steakknight>**!"
    );
  },

  options: {
    description: "Invite the bot!",
    fullDescription: "Spits out a link to the bot's invite!",
    usage: "`sk invite`"
  },
  name: "invite"
};
