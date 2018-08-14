module.exports = {
  func: async (msg, args) => {
    // checks for permissions
    if (
      msg.author.id == "107563269484490752" ||
      msg.member.permission.has("banMembers") == true
    )
      // purges messages
      msg.channel.purge(parseInt(args[0]) + 2);
  },
  options: {
    description: "PURGE THE WEAK!",
    fullDescription:
      "Purges X messages, requires at least Ban Member permissions",
    usage: "`sk purge X`"
  },
  name: "purge"
};
