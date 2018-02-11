
  module.exports = {
    func: async (msg, args) => {if (msg.member.permission.has("kickMembers")==true){
      try {
      msg.channel.guild.kickMember(msg.mentions[0].id,args.join(" "))

      }
      catch (error){
          msg.channel.createMessage("That didn't work!")
      }
  }},
    options: {},
    name: "kick"
}