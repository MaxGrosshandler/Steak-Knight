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
        title: "Information about Steak Knight",
        description:
          "Server count: " +
          bot.guilds.size +
          "\nUptime: " +
          hours +
          " hours " +
          minutes +
          " minutes " +
          seconds +
          " seconds" +
          " \nLibrary: Eris\nGithub: [here](https://github.com/MaxGrosshandler/Steak-Knight) \nDonate: [please I need money](https://paypal.me/MaxGrosshandler)" +
          "\nSupport Server: [here](https://discord.gg/4xbwxe6)\nInvite me: [here](https://discordapp.com/api/oauth2/authorize?client_id=397898847906430976&permissions=0&scope=bot)"
      }
    });
  },
  options: {
    description: "Information!",
    fullDescription: "Provides helpful information about the bot",
    usage: "`sk info`"
  },
  name: "info"
};
