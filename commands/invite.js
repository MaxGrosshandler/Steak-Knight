module.exports = {
  func: async (msg, args) => {
    msg.channel.createMessage(
      "Invite me with <https://discordapp.com/api/oauth2/authorize?client_id=397898847906430976&permissions=0&scope=bot>"
    );
  },

  options: {
    description: "Invite the bot!",
    fullDescription: "Spits out a link to the bot's invite!",
    usage: "`sk invite`"
  },
  name: "invite"
};
