module.exports = {
  func(msg, args) {
      if (typeof args == 'undefined') msg.channel.createMessage("this ran without args")
      else {
          msg.channel.createMessage("the args are: "  + args)
        }

  }, 
options: {
  description: "Get support!",
  fullDescription: "Provides an invite to the bot's support server",
  usage: "`sk support`"
},
name: "testcase"
}
