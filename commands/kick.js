//currently out of commission
module.exports = {
  // checks permissions
  func: async (msg, args) => {
    if (msg.member.permission.has("kickMembers") == true) {
      try {
        // kicks the user
        msg.channel.guild.kickMember(args[1].replace(/[^a-zA-Z0-9]/g, ''), args.join(" "));
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
