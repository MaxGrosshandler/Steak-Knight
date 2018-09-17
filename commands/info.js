var moment = require("moment");
var server = require("../server.js");
const bot = server.bot;
module.exports = {
  func: async (msg, args) => {
    let time = moment.duration(moment() - bot.startTime);
    let hours = time.hours();
    let minutes = time.minutes();
    let seconds = time.seconds();
    msg.channel.createMessage({
      embed: {
        "author":
        {
          "name":"Information about Steak Knight","icon_url":"https://cdn.discordapp.com/avatars/397898847906430976/8c2be2ff0c2a5b4981c8d705ef50d8c5.png?size=512","url":"https://bots.discord.pw/bots/397898847906430976"
        }
        ,"color":3553599,
        "description":"​\n**Steak Knight is a multipurpose bot for all your steak related needs!** \nHe's got some image commands, like hug, the ability to give out roles, guild-specific prefixes, and more coming soon!\n\n[Invite](https://discordapp.com/api/oauth2/authorize?client_id=397898847906430976&permissions=0&scope=bot) - [Server](https://discord.gg/4xbwxe6) - [Github](https://github.com/MaxGrosshandler/Steak-Knight) - [Donate](https://www.paypal.me/MaxGrosshandler)​ ​​ ​​ ​​ ​​ ​—​ ​​ ​​ ​​ ​​ ​*Run​ ​ ​`sk help` to learn more.*\n​",

        footer: {"text":"Servers: " + bot.guilds.size +" | Uptime: " +hours+"h " +minutes+"min " +seconds+"s | Powered by Eris and grandmother's steak recipe."} 
      }     
      }
    );
  },
  options: {
    description: "Information!",
    fullDescription: "Provides helpful information about the bot",
    usage: "`sk info`"
  },
  name: "info"
};
