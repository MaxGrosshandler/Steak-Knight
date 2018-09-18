var express = require("express");
var app = express();
const fs = require("fs");
const Eris = require("eris")
const droll = require('droll');
const Taihou = require('taihou');
const weebSH = new Taihou(process.env.wolke, true, {
    userAgent: 'Steak Knight/4.0.0'
});

const sf = require("snekfetch");
var pg = require("pg");

var bot = new Eris.Client(
    process.env.token,
    {
        restMode: true
    }
);
const num = Math.random();

/* BEGIN ZOMBIEWATCH */

const ZombieWatch = require('./ZombieWatch');
const zombieWatch = new ZombieWatch(bot);
bot.zombieWatch = zombieWatch;

/* END ZOMBIEWATCH */

bot.on("guildCreate", async guild => {
    for (const [id, channel] of guild.channels) {
        if (channel.type === 0) { // check if text channel
            let perms = channel.permissionsOf(bot.user.id).json;
            if (perms.readMessages && perms.sendMessages) {
                await channel.createMessage('Hi, my name is Steak Knight! Thanks for inviting me to your server! You can look at my commands with `sk help`. If you have trouble and/or the bot is not working as he should (I have been doing a lot of testing lately) please head over to the support server at https://discordapp.com/invite/4xbwxe6 Have a steak-tastic day!');
                break;
            }
        }
    }
});
bot.on("guildMemberAdd", async (guild, member) => {
    console.log(guild)
    console.log(member)
if (guild.id === "481243726392328192"){
    let command = commands.find(function (cmd) {
        return cmd.name == "currency"
    })
    let message = await bot.getMessage("481243727499886613", "481425438430855168").then(msg =>{
        return msg;
    })
    command.func(message, ["add", member.id, "100"])

}
})

let client = new pg.Client(process.env.url);
function pgConnect() {
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
const job = new CronJob('00 00 00 * * 0-6', function () {
    const d = new Date();
    console.log('reset at , ' + d)
    client.query('DELETE FROM waiting');
});
job.start();

//const pkill = new CronJob('0 */40 * * * *', function () {
//  process.exit();

//});

//pkill.start();
//console.log('is the kill job running? ', pkill.running);
//console.log(' i am kill job', pkill.nextDates())


let helpCommands = [];
let commands = [];
function readCommands() {
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


                let hiddenCommands = ['eval', 'donate', 'help', 'clean', 'zombiewatch', 'stupidcat']
                if (!(hiddenCommands.includes(command.name))) {
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
}
let weebArray = ['animal_cat', 'animal_dog', 'awoo', 'bang', 'banghead',

    'bite', 'blush', 'clagwimoth', 'cry', 'cuddle',

    'dab', 'dance', 'delet_this', 'deredere', 'discord_memes',

    'greet', 'handholding, highfive, hug, initial_d',

    'insult', 'jojo', 'kemonomimi', 'kiss', 'lewd',

    'lick', 'megumin', 'nani', 'neko', 'nom',

    'owo', 'pat', 'poi', 'poke', 'pout',

    'punch', 'rem', 'shrug', 'slap', 'sleepy',

    'smile', 'smug', 'stare', 'sumfuk', 'teehee',

    'thinking', 'thumbsup', 'tickle', 'trap', 'triggered',

    'wag', 'waifu_insult', 'wasted']


bot.on("messageCreate", async msg => {
    if (msg.author.bot) return;


    if (msg.content.toLowerCase().startsWith("sbs ")) {

        let command = commands.find(function (cmd) {
            return cmd.name == "bottle"
        })

        let snakes = msg.content.split(" ")
        snakes.shift();
        let spoops = snakes.join(" ")
        let potato = "send " + spoops;
        let args = potato.split(" ")
        command.func(msg, args)
        return;
    }
    else if (msg.content.toLowerCase().startsWith("sbss ")) {

        let command = commands.find(function (cmd) {
            return cmd.name == "bottle"
        })

        let snakes = msg.content.split(" ")
        snakes.shift();
        let spoops = snakes.join(" ")
        let potato = "send sign " + spoops;
        let args = potato.split(" ")
        command.func(msg, args)
        return;
    }
    if (msg.content.toLowerCase() == "srf") {
        let command = commands.find(function (cmd) {
            return cmd.name == "rpg"
        })
        let args = ["fight"];
        command.func(msg, args);
    }
    if (msg.content.toLowerCase() == "sboi") {
        let command = commands.find(function (cmd) {
            return cmd.name == "bottle"
        })
        let args = ["opt-in"]
        command.func(msg, args);

    }
    if (msg.content.toLowerCase == "sboo") {
        let command = commands.find(function (cmd) {
            return cmd.name == "bottle"
        })
        let args = ["opt-out"]
        command.func(msg, args);

    }
    if (msg.content.toLowerCase() == "sk types") {
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

    if (msg.content.toLowerCase().startsWith("sk ")) {
        let stuff = msg.content.split(" ")
        let c = stuff[1];
        stuff.shift()
        if (weebArray.includes(c)) {
            try {
                weebSH.toph.getRandomImage(c).then(image => {
                    console.log(image)
                    try {
                        msg.channel.createMessage({
                            embed: {
                                image: {
                                    url: image.url
                                },
                                footer: {
                                    text: "Powered by weeb.sh"
                                }

                            }
                        });
                    }

                    catch (err) {
                        console.log("something went wrong")
                    }
                })
            }
            catch (err) {
                console.log("whoops")
            }
        }

        else {
            commands.forEach(function (command) {
                if (command.name == c) {
                    stuff.shift();
                    command.func(msg, stuff)
                    console.log("Command was sk " + command.name + " and was invoked by " + msg.author.username + " with the id of " + msg.author.id)
                }

            })
        }
    }
});

async function postStats() {
    try {
        await sf
            .post("https://bots.discord.pw/api/bots/397898847906430976/stats")
            .set({ Authorization: process.env.dbots })
            .send({ server_count: bot.guilds.size });
        console.log("Stats have been posted to Discord Bots.");
    } catch (err) {
        console.error(err);
    }
}

async function carbon() {
    try {
        await sf
            .post("https://www.carbonitex.net/discord/data/botdata.php")
            .send({ servercount: bot.guilds.size, key: process.env.carbon });
        console.log("Stats have been posted to Carbon.")
    }
    catch (err) {
        console.error(err);
    }
}
pgConnect();
readCommands();
bot.connect();
bot.on("ready", () => {

    bot.createMessage("479687321948520448", "I started up!");
    console.log("this instance number is " + num)
    console.log("Ready!");
    postStats();
    carbon();
    bot.editStatus("online", { name: `${bot.guilds.size} servers | sk help`, type: 3 });
});

module.exports.client = client;
module.exports.bot = bot;
module.exports.sf = sf;
module.exports.weebSH = weebSH;
module.exports.helpCommands = helpCommands;
module.exports.droll = droll;
app.use(express.static(__dirname + "/public"));
app.listen(process.env.PORT || 4000);
