
module.exports = {
    func: async (msg, args) => {
        if ((msg.author.id == "107563269484490752") || (msg.member.permission.has("banMembers") == true))
        msg.channel.purge(parseInt(args[0]) + 2)
    },
    options: {},
    name: "purge"
}