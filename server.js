var express = require("express");
var app = express();
const fs = require("fs");
const Eris = require("eris");
const commands = require("./commands");
const sf = require("snekfetch");
var pg = require("pg");
var moment = require("moment");
var config = require("./config.json");
var bot = new Eris.CommandClient(
  config.token,
  {},
  {
    description: "A bot for all your steak needs!",
    owner: "Xamtheking#2099 and MaxGrosshandler#6592",
    prefix: ["sk ", "Sk ", "bend over and ", "Bend over and "],
    defaultHelpCommand: false
  }
);
bot.on("guildCreate", async guild => {
  if (guild.members.filter(m => m.bot).length / guild.memberCount > 0.5) {
    console.log("oh no");
    bot.leaveGuild(guild.id);
  }
  for (const channel of guild.channels) {
    try {
      await bot.createMessage(
        channel[0],
        "Hi, my name is Steak Knight! You can see my commands with `sk help` !"
      );
      break;
    } catch (err) {}
  }
});
let client = new pg.Client(config.url);
client.connect(function(err) {
  if (err) {
    return console.error("could not connect to postgres", err);
  }
  client.query('SELECT NOW() AS "theTime"', function(err, result) {
    if (err) {
      return console.error("error running query", err);
    }
    console.log(result.rows[0].theTime);
    //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
  });
});
let helpCommands = [];
fs.readdir("./commands", (err, files) => {
  if (err) console.error(err);
  console.log(
    `Loading a total of ${files.length} commands into memory.`,
    false
  );
  files.forEach(file => {
    try {
      const command = require(`./commands/${file}`);
      console.log(`Attempting to load the command "${command.name}".`, false);
      let newCommand = [
        command.name,
        command.options.description,
        command.options.fullDescription,
        command.options.usage,
        command.func
      ];
      helpCommands.push(newCommand);
      bot.registerCommand(command.name, command.func, command.options);
    } catch (err) {
      console.log(
        "An error has occured trying to load a command. Here is the error."
      );
      console.log(err.stack);
    }
  });
  console.log("Command Loading complete!");
  console.log("\n");
});
client.query("SELECT * FROM prefixes").then(res => {
  for (item of res.rows) {
    bot.registerGuildPrefix(item.id, item.list);
  }
});
bot.on("messageCreate", msg => {
  if (msg.content == "Who is undeniably the best girl?") {
    msg.channel.createMessage("Midna is the best girl.");
  }
});
async function postStats() {
  try {
    await sf
      .post("https://bots.discord.pw/api/bots/397898847906430976/stats")
      .set({ Authorization: config.dbots })
      .send({ server_count: bot.guilds.size });
    console.log("Stats have been posted.");
  } catch (err) {
    console.error(err);
  }
}
let str = "";
bot.registerCommand("help", (msg, args) => {
  if (typeof args[0] == "undefined") {
    helpCommands.forEach(cmd => {
      str += "sk " + cmd[0] + " - " + cmd[1] + "\n";
    });
    str += "Use `sk help <command>` for more detailed information.";
    msg.channel.createMessage({
      embed: {
        description: str,
        title: "My help command"
      }
    });
    str = "";
  } else if (typeof args[0] !== "undefined") {
    let cmd;
    helpCommands.forEach(c => {
      if (c[0] == args[0]) {
        cmd = c;
        return;
      }
    });
    if (typeof cmd !== "undefined") {
      msg.channel.createMessage({
        embed: {
          title: "**" + cmd[0] + "**",
          description: cmd[2] + "\n" + cmd[3]
        }
      });
    }
  }
});
/*
bot.registerCommand("info", msg => {
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
        "\nSupport Server: [here](https://discord.gg/VX9GBc)\nInvite me: [here](https://discordapp.com/api/oauth2/authorize?client_id=397898847906430976&permissions=0&scope=bot)"
    }
  });
});
*/

bot.connect();
bot.on("ready", () => {
  console.log("Ready!");
  console.log(bot.guilds.size);
  postStats();
  bot.editStatus("online", { name: "sk help" });
});

module.exports.client = client;
module.exports.bot = bot;
app.use(express.static(__dirname + "/public"));
app.listen(process.env.PORT || 4000);
