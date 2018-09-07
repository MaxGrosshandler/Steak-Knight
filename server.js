var express = require("express");
var app = express();
const fs = require("fs");
const Eris = (require("eris"))
const Taihou = require('taihou');
const weebSH = new Taihou(process.env.wolke, true, {
    userAgent: 'Steak Knight/4.0.0'
});

const sf = require("snekfetch");
var pg = require("pg");
const puppeteer = require("puppeteer");


var bot = new Eris.CommandClient(
    process.env.token,
    {
        restMode: true,
       autoreconnect: true
    },
    {
        description: "A bot for all your steak needs!",
        owner: "Xamtheking#2099 and MaxGrosshandler#6592",
        prefix: ["sk "],
        defaultHelpCommand: false,
        
    }
);
const num = Math.random();

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
    weebSH.tama.updateSetting({type: 'guilds', id: guild.id, data: {prefix: "sk "}})
        .then(console.log(""))
        .catch(console.error)
  });


let client = new pg.Client(process.env.url);
function pgConnect(){
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
}
const CronJob = require('cron').CronJob;
const job = new CronJob('00 00 00 * * 1-7', function() {
	const d = new Date();
    console.log('reset at , ' + d)
    client.query('DELETE FROM waiting');
});
job.start();
console.log('is job running on high? ', job.running);
console.log(' i am job ', job.nextDates())

let helpCommands = [];
let commands = [];
function readCommands(){
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
    console.log("Command Loading complete and it's on travis!");
    console.log("\n");
});
}



bot.on("messageCreate", msg => {
  if (msg.author.bot && msg.author.id !== "397898847906430976")return;
    if (msg.author.id == "397898847906430976" && msg.content.startsWith("kill"
    )){
        const test = msg.content.split(" ");
        const kill = parseInt(test[1], 10)
        console.log(test)
        console.log(kill)
        console.log(num)
        if (kill !== num){
            process.exit();
        }
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
  if (msg.content.toLowerCase() == "sk types"){
      msg.channel.createMessage({
          embed: {
            image: {
                url: "https://owo.whats-th.is/d2e2c0.png"
            }
          }
      })
      return;
  }
    if (msg.content == "Who is undeniably the best girl?") {
        msg.channel.createMessage("Midna is the best girl.");
    }
    if (msg.channel.guild == undefined){
        if (msg.content.toLowerCase().startsWith("sk ")) {
            let stuff = msg.content.split(" ")
            let c = stuff[1];
            stuff.shift();
            if (typeof msg.mentions[0]!== "undefined" && c !== "currency"){
                weebSH.toph.getImageTypes()
                .then(array => {
                    if (array.types.includes(c)) {
                    try {
                        let command = commands.find(function (command){
                            return command.name == "weeb"
                        })
                        command.func(msg, stuff);
                        console.log("Command was sk " + command.name + " and was in a dm")
                    }
                    catch(err) {
                        console.log("whoopsies")
                    }
                }
        
                }
            )
            }
            else {
            stuff.shift();
           
            commands.forEach(function (command) {
                    if (command.name == c) {
                        command.func(msg, stuff)
                        console.log("Command was sk " +command.name + " and was in a dm")
                    }
                }
            
            )
        }
    }

    }
    else {
    weebSH.tama.getSetting('guilds', msg.channel.guild.id)
    .then(setting => {

        if (msg.content.toLowerCase().startsWith(setting.setting.data.prefix.toLowerCase())) {
            let stuff = msg.content.split(" ")
            let c = stuff[1];
            stuff.shift();
            
      
            if (typeof msg.mentions[0]!== "undefined" && c !== "currency"){
                weebSH.toph.getImageTypes()
                .then(array => {
                    if (array.types.includes(c)) {
                    try {
                        let command = commands.find(function (command){
                            return command.name == "weeb"
                        })
                        command.func(msg, stuff);
                        console.log("Command was sk " +command.name + " and was in "+ msg.channel.guild.name)
                    }
                    catch(err) {
                        console.log("whoopsies")
                    }
                }
        
                }
            )
            }
            else {
            stuff.shift();
           
            commands.forEach(function (command) {
                    if (command.name == c) {
                        command.func(msg, stuff)
                        console.log("Command was sk " +command.name + " and was in "+ msg.channel.guild.name)
                    }
                }
            
            )
        }
    }


        
    })
}
    //.catch(console.error)
  
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

bot.connect();
bot.on("ready", () => {

    bot.createMessage("479687321948520448", "kill "+num);
    console.log("this instance number is "+ num)
    console.log("Ready!");
    pgConnect();
    readCommands();


    postStats();
    carbon();
    //getHelp();
    bot.editStatus("online", {name: "sk help"});
});

module.exports.client = client;
module.exports.bot = bot;
module.exports.sf = sf;
module.exports.weebSH = weebSH;
module.exports.helpCommands = helpCommands;
module.exports.puppeteer = puppeteer;
app.use(express.static(__dirname + "/public"));
app.listen(process.env.PORT || 4000);
