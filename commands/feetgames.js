
module.exports = {
  func: async (msg, args) => {
    // checks for mention
    if (msg.author.id == "107563269484490752") msg.channel.createMessage("WesternBlaze loves feet very much!");
  },

  options: 
  {
    description: "plz ignore",
    fullDescription: "memes",
    usage: "Usage: \`sk feetgames\`",
    guildOnly: true,
    hidden: true
  },
  name: "feetgames"
}