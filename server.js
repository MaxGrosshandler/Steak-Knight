var express = require("express");
var app = express();
const fs = require("fs");
const Eris = (require("eris"))
const GoogleImages = require('google-images');
const weeb = require("weeb.js");
 
const sh = new weeb(process.env.wolke);
 

var Bing = require('node-bing-api')({accKey: process.env.bing});
const sf = require("snekfetch");
var pg = require("pg");



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
    for (const [id, channel] of guild.channels) {
      if (channel.type === 0) { // check if text channel
        let perms = channel.permissionsOf(bot.user.id).json;
        if (perms.readMessages && perms.sendMessages) {
           await channel.createMessage('Hi, my name is Steak Knight! Thanks for inviting me to your server! You can look at my commands with `sk help`. If you have any trouble, come to our support server located at https://discord.gg/4xbwxe6 and be sure to ask plenty of questions! Have a steak-tastic day!');
        break;
        }
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


                let newCommand = [
                    command.name,
                    command.options.description,
                    command.options.fullDescription,
                    command.options.usage,
                    command.func,
                    command.hidden
                ];
                commands.push(command)
                if (command.name !== "weeb"){
                    helpCommands.push(newCommand);
                }
                
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
let arr;
bot.on("messageCreate", msg => {
  if (msg.author.bot)return;
  if (msg.content.startsWith("sws ") || msg.content.startsWith("Sws ")){
    let command = commands.find(function (cmd) {
        return cmd.name == "slap"
      })
  
   let args = msg.content.split(" ")
     args.shift();
      args.shift();
      command.func(msg, args)
      return;
  }
  if (msg.content.startsWith("sbs ") || msg.content.startsWith("Sbs ")){
    
    let command = commands.find(function (cmd) {
      return cmd.name == "bottle"
    })

 let snakes = msg.content.split(" ")
   snakes.shift();
    let spoops = snakes.join(" ")
    let potato = "send "+ spoops;
    let args = potato.split(" ")
    command.func(msg, args)
    return;
  }
  else if (msg.content.startsWith("sbss ") || msg.content.startsWith("Sbss ")){
    
    let command = commands.find(function (cmd) {
      return cmd.name == "bottle"
    })

 let snakes = msg.content.split(" ")
   snakes.shift();
    let spoops = snakes.join(" ")
    let potato = "send sign "+ spoops;
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

         sh.getTypes().then(array => {
            arr = array
        });
        if (typeof msg.mentions[0]!== "undefined" && c !== "hug" && arr.includes(c)){

            let command = commands.find(function (command){
                return command.name == "weeb"
            })
            command.func(msg, stuff);
        }
        else {
        stuff.shift();
       
        commands.forEach(function (command) {
                if (command.name == c) {
                    command.func(msg, stuff)
                }
            }
        
        )
    }
}
});

async function postStats() {
    try {
        await sf
            .post("https://bots.discord.pw/api/bots/397898847906430976/stats")
            .set({Authorization: process.env.dbots})
            .send({server_count: bot.guilds.size});
        console.log("Stats have been posted to Discord Bots.");
    } catch (err) {
        console.error(err);
    }
}

async function carbon() {
    try {
        await sf
            .post("https://www.carbonitex.net/discord/data/botdata.php")
            .send({servercount: bot.guilds.size, key: process.env.carbon});
        console.log("Stats have been posted to Carbon.")
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
module.exports.sh = sh;
module.exports.sf = sf;
app.use(express.static(__dirname + "/public"));
app.listen(process.env.PORT || 4000);
