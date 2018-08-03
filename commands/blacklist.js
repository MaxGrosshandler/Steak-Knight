
module.exports = {
  func: async (msg, args) => {
    // checks for mention
    if (!args[0] || msg.author.id !== "107563269484490752") msg.channel.createMessage("You need to specify someone to blacklist, or you don't have permissions!");
 
    else { // pretends to blacklist the user
                msg.channel.createMessage("This user has been blacklisted successfully.");
    // so on and so forth
  }
  },

  options: 
  {
    description: "Pretends to blacklist a user!",
    fullDescription: "FOR THE MEMES!",
    usage: "Usage: \`sk blacklist @xamtheking\`",
    argsRequired: true,
    guildOnly: true,
    hidden: true
  },
  name: "blacklist"
}