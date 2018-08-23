module.exports = {
  // checks permissions
  func: async (msg, args) => {
    if (msg.member.permission.has("kickMembers") == true) {
      try {
        // kicks the user
        msg.channel.guild.kickMember(msg.mentions[0].id, args.join(" "));
        msg.channel.createMessage("Member kicked.");
      } catch (error) {
        msg.channel.createMessage("That didn't work!");
      }
    }
  },
  options: {
    description: "Kicks a user!",
    fullDescription: "Kicks a user! Make sure the bot has the needed perms.",
    usage: "`sk kick @user <reason>`"
  },
  name: "kick"
};
