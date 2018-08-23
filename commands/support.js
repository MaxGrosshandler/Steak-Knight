module.exports = {
  func(msg) {
    msg.channel.createMessage("Join my support server at https://discord.gg/4xbwxe6")
  },
options: {
  description: "Get support!",
  fullDescription: "Provides an invite to the bot's support server",
  usage: "`sk support`",
  argsReq: false
},
name: "support"
}
