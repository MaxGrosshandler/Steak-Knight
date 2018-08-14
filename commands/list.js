
const bot = require("../app.js")
module.exports = {
    func: async (msg, args) => {
        for (var [key, value] of bot.guilds) {
            console.log(bot.guilds.get(key).name)
        }
    
    }
,
    options: {
        requirements: {
            "userIDs": "107563269484490752"  
        },
        hidden: true,
        guildOnly: true,
        description: "Gives a user a role!",
        fullDescription: "Gives a user a role. Make sure the bot has the needed perms.",
        usage: "`sk role @user rolename`"
    },
    name: "list"
}