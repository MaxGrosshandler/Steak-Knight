var express = require("express");
var app = express();
const fs = require("fs");
const Eris = (require("eris"))
const GoogleImages = require('google-images');
var Bing = require('node-bing-api')({accKey: '815633e9101a46529a64fac7b11575d3'});


const gclient = new GoogleImages(process.env.CSE_ID, process.env.CSE_API_KEY);
const sf = require("snekfetch");
var pg = require("pg");
var moment = require("moment");


var bot = new Eris.CommandClient(
    process.env.token,
    {},
    {
        description: "A bot for all your steak needs!",
        owner: "Xamtheking#2099 and MaxGrosshandler#6592",
        prefix: ["sk ", "Sk ", "bend over and ", "Bend over and "],
        defaultHelpCommand: false
    }
);
bot.on("guildCreate", async guild => {
    if (guild.members.filter(m => m.bot).length / guild.memberCount > 0.7) {
        bot.leaveGuild(guild.id);
    }

    for (const channel of guild.channels) {
        try {
            bot.getMessages(channel[0], 1).then(async msg => {
                if (msg[0].channel.permissionsOf("474601951393480704").has("sendMessages")) {
                    await msg[0].channel.createMessage("Hi, my name is Steak Knight! Thanks for inviting me to your server! You can look at my commands with `sk help`. If you have any trouble, come to our support server with `sk support` and be sure to ask plenty of questions! Have a steak-tastic day!")
                }
        })
            break;
        } catch (err) {

        }

    }
});


let client = new pg.Client(process.env.url);
client.connect(function (err) {
    if (err) {
        return console.error("could not connect to postgres", err);
    }
    client.query('SELECT NOW() AS "theTime"', function (err, result) {
        if (err) {
            return console.error("error running query", err);
        }
        console.log(result.rows[0].theTime);
        //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
    });
});

let helpCommands = [];
let commands = [];
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

                let aliases = [];

                if(command.aliases)
                    aliases = command.aliases;

                let newCommand = [
                    command.name,
                    command.options.description,
                    command.options.fullDescription,
                    command.options.usage,
                    command.func,
                    aliases
                ];
                commands.push(command)
                helpCommands.push(newCommand);
            } catch (err) {
                console.log(
                    "An error has occured trying to load a command. Here is the error."
                );
                console.log(err.stack);
            }
        }
    );
    console.log("Command Loading complete!");
    console.log("\n");
});

client.query("SELECT * FROM prefixes").then(res => {
    for (item of res.rows) {
        bot.registerGuildPrefix(item.id, item.list);
    }
});

bot.on("messageCreate", msg => {
let c = "";
let snorlax = "send "
  if (msg.author.bot)return;
  if (msg.content.startsWith("sbs ") || msg.content.startsWith("Sbs ")){
    
    let command = commands.find(function (cmd) {
      return cmd.name == "bottle"
    })

 let snakes = msg.content.split(" ")
   snakes.shift();
    let spoops = snakes.join(" ")
    let potato = snorlax + spoops;
    let args = potato.split(" ")
    command.func(msg, args)
    return;
  }
  if (msg.content == "sboi" || msg.content == "Sboi" ){
    let command = commands.find(function (cmd) {
      return cmd.name == "bottle"
    })
    let args = ["opt-in"]
    command.func(msg, args);
    
  }
  if (msg.content == "sboo" || msg.content=="Sboo"){
    let command = commands.find(function (cmd) {
      return cmd.name == "bottle"
    })
    let args = ["opt-out"]
    command.func(msg, args);
    
  }
    if (msg.content == "Who is undeniably the best girl?") {
        msg.channel.createMessage("Midna is the best girl.");
    }
    if (msg.content.startsWith(bot.commandOptions.prefix[0]) ||
        msg.content.startsWith(bot.commandOptions.prefix[1])) {
        let stuff = msg.content.split(" ")
        let c = stuff[1];
        stuff.shift();
        stuff.shift();
        console.log(stuff)
        commands.forEach(function (command) {
                if (command.name == c) {
                    command.func(msg, stuff)
                }
            }
        )
    }
});

async function postStats() {
    try {
        await sf
            .post("https://bots.discord.pw/api/bots/397898847906430976/stats")
            .set({Authorization: process.env.dbots})
            .send({server_count: bot.guilds.size});
        console.log("Stats have been posted.");
    } catch (err) {
        console.error(err);
    }
}

async function carbon() {
    try {
        await sf
            .post("https://www.carbonitex.net/discord/data/botdata.php")
            .set({key: process.env.carbon})
            .send({servercount: bot.guilds.size});
        console.log("Carbon!")
    }
    catch (err) {
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
bot.registerCommand("steak", (msg) => {
    Bing.images("Filet Mignon", {count: 10}, function(error, res, body){
        msg.channel.createMessage({
            embed: {
                image:{
                    url: body.value[parseInt(Math.random()* 10)].contentUrl
                } 
            }
        });
    });


})


bot.connect();
bot.on("ready", () => {
    console.log("Ready!");
    console.log(bot.guilds.size);
    postStats();
    carbon();
    bot.editStatus("online", {name: "sk help"});
});

module.exports.client = client;
module.exports.bot = bot;
app.use(express.static(__dirname + "/public"));
app.listen(process.env.PORT || 4000);
