module.exports = {
  func() {
return "this ran without args"

  }, 
  argError (){
    return "you shouldn't have arguments"
  },
  argMiss (){
    return "you are missing arguments!"
  },
options: {
  description: "Get support!",
  fullDescription: "Provides an invite to the bot's support server",
  usage: "`sk support`",
  argsReq: false
},
name: "support"
}
