module.exports = {
  func: async (msg, args) => {
    // checks for permissions. Either you need to be able to ban members or be me, will work on making cleaner
    if (
      msg.author.id == "107563269484490752" ||
      msg.author.id == "195156669108322313" ||
      msg.member.permission.has("banMembers") == true
    )
      msg.channel.getMessages(parseInt(args[0] + 1)).then(m => {
        for (let message of m) {
          if (message.author.id == "397898847906430976") {
            message.channel.deleteMessage(message.id);
          }
        }
      });
  },
  options: {
    description: "Cleans messages",
    fullDescription: "Clean `X` amount of messages",
    argsRequired: true,
    guildOnly: true
  },
  name: "clean"
};
