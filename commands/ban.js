

module.exports = {
  func: async (msg, args) => {
    // checks to see if the user has the needed permissions
    if (msg.member.permission.has("banMembers")==true){
      // bans the member
      msg.channel.guild.banMember(msg.mentions[0].id, 0, args.join(" "))
}

},
  options: {
    description: "Bans people!",
    fullDesc: "Bans a user from your server.",
    usage: "`sk ban @user <reason>"
  },
  name: "ban"
}