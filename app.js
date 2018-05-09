const config = require("./config.json");
var Raven = require('raven');
Raven.config(config.ravenConfig).install();
const Eris = require("eris");
const fs = require("fs");
var pm2 = require("pm2")
var mysql = require('mysql');

var bot = new Eris.CommandClient(config.token, {}, {
    description: "Steak Knight: A bot for all your steak needs!",
    owner: "Xamtheking#2099",
    prefix: ["sk ", "Sk "],
    ignoreBots: true,
    defaultHelpCommand: true
});
global.bot = bot;
//much thanks to jtsshieh and DAPI in general
fs.readdir('./commands', (err, files) => {
    if (err) console.error(err);
    console.log(`Attempting to load a total of ${files.length} commands into the memory.`, false);
    files.forEach(file => {
        try {
            const command = require(`./commands/${file}`);
            console.log(`Attempting to load the command "${command.name}".`, false);
            bot.registerCommand(command.name, command.func, command.options);
        } catch (err) {
            console.log('An error has occured trying to load a command. Here is the error.');
            console.log(err.stack);
        }
    });
    console.log('Command Loading complete!');
    console.log('\n');
});
bot.on("ready", () => { // When the bot is ready
    console.log("Ready!"); // Log "Ready!"
    console.log(bot.guilds.size)

});
bot.on('messageCreate', msg => {
    if (msg.content == "Who is undeniably the best girl?") {
        msg.channel.createMessage("Midna is the best girl.")
    }
})


var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'test'
});

connection.connect();


connection.query("SELECT * FROM prefixes",function (error, results, fields){
for (item of results){
    bot.registerGuildPrefix(item.gid,item.prefixes)
}
}
)

  

bot.registerCommand("github", (msg) => {
    msg.channel.createMessage("https://github.com/MaxGrosshandler/Steak-Knight")
}, {
    description: "See my codebase!"
})
bot.registerCommand("p", (msg, args) => {
    let file = fs.readFileSync('./pictures/steak.jpg');
    if (args[0] == "steak") {
        msg.channel.createMessage('', {
            file,
            name: 'steak.jpg'
        });
    } else if (args[0] == "knife") {
        file = fs.readFileSync('./pictures/knife.jpg');
        msg.channel.createMessage('', {
            file,
            name: 'knife.jpg'
        });
    } else if (args[0] == "hack") {

        try {
            msg.channel.createMessage({
                embed: {
                    image: {
                        url: "https://i.imgur.com/iVHfwLc.gif"
                    }
                }
            })

        } catch (Error) {
            msg.channel.createMessage("Something went wrong");
        }
    } else if (args[0] == "ree") {

        try {
            msg.channel.createMessage({
                embed: {
                    image: {
                        url: "https://cdn.discordapp.com/attachments/133441659198373889/402667691648745472/Snapchat-1199464898.jpg"
                    }
                }
            })

        } catch (Error) {
            msg.channel.createMessage("Something went wrong");
        }

    } else if (args[0] == "party") {

        try {
            msg.channel.createMessage({
                embed: {
                    image: {
                        url: "https://media1.tenor.com/images/43d6b59a8559a4f84afd6c185ba4df19/tenor.gif"
                    }
                }
            })

        } catch (Error) {
            msg.channel.createMessage("Something went wrong");
        }

    }
}, {
    description: "Picture command!",
    fullDescription: "Looks for a picture in the storage and posts it. Current pictures are \`steak\`, \`knife\`" +
        ",\`hack\`, \`ree\`, and \`party\`",
    usage: "Usage: \`sk p knife\`",
    argsRequired: true,
    guildOnly: true
});

bot.registerCommand('prefix', (msg, args)=>{
var sql = "INSERT INTO ?? VALUES(?,?);";
var newprefix = args[0]
if (newprefix == "reset"){
    var sql = "Delete from prefixes  WHERE gid=?";
    var inserts = [msg.channel.guild.id]
    sql = mysql.format(sql, inserts);
connection.query(sql);
bot.registerGuildPrefix(msg.channel.guild.id, ["sk ", "Sk "]);
msg.channel.createMessage("Prefixes have been reset.")
return;
}
var inserts = ['prefixes', msg.channel.guild.id, newprefix];
sql = mysql.format(sql, inserts);
connection.query(sql);
bot.registerGuildPrefix(msg.channel.guild.id, args[0]);
msg.channel.createMessage("Your new prefix is " + args[0])
}
)



bot.registerCommand("invite", (msg, args) => {
    msg.channel.createMessage("Invite me with <https://discordapp.com/api/oauth2/authorize?client_id=397898847906430976&permissions=0&scope=bot>")
}, {
    description: "Invite the bot to your server!"
})
bot.registerCommand("donate", (msg, args) => {
    msg.channel.createMessage("If you want to help speed up development and make me feel like I'm worth something," +
        "\nplease consider donating to me at https://www.paypal.me/MaxGrosshandler. Every little bit is appreciated.")
}, {
    description: "Donate to the bot's creator!"
});
//below made by ratismal, the best boi
bot.registerCommand("eval", async (msg, args) => {
    if (msg.author.id == config.id) {
        let toExecute;
        let code = args.join(' ');
        if (code.split('\n').length === 1)
            toExecute = eval(`async () => ${code}`);
        else toExecute = eval(`async () => { ${code} }`);
        toExecute.bind(this);
        try {
            msg.channel.createMessage(await toExecute());
        } catch (err) {
            msg.channel.createMessage(err.stack);
        }
    }
}, {
    description: "Eval!",
    fullDescription: "For evaluating things! Owner only.",
    guildOnly: true,
    argsRequired: true,
    hidden: true
});
bot.connect();
module.exports = bot;