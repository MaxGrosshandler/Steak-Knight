

module.exports = {
  func: async (msg, args) => {
    if (msg.member.permission.has("banMembers")==true){
      msg.channel.guild.banMember(msg.mentions[0].id, 0, args.join(" "))
}

},
  options: {},
  name: "ban"
}