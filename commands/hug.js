
module.exports = {
  func: async (msg, args) => {
    if (!args[0]) msg.channel.createMessage("You need to specify someone to hug!");

    else {
        try {
            msg.channel.createMessage(msg.mentions[0].username + ", you have been hugged!\nhttps://i.imgur.com/O3f6NoJ.gif");
        } catch (Error) {
            msg.channel.createMessage("You need to mention someone to hug!");
        }
}
    // so on and so forth
  },
  options: 
  {
    description: "Gives a user a hug!",
    fullDescription: "Provides a user with a steak-filled hug!",
    usage: "Usage: \`sk hug @xamtheking\`",
    argsRequired: true,
    guildOnly: true
  },
  name: "hug"
}