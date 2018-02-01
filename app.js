const config = require("./config.json");
var Raven = require('raven');
Raven.config('https://10cedb5c913647ff82c39805f60ff3a0:597b61d426aa4312857e22dca9bde566@sentry.io/277301').install();
const Eris = require("eris");
const fs = require("fs");

const droll = require('droll');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'me',
    database: 'test'
});
connection.connect();


// Replace BOT_TOKEN with your bot account's token
var bot = new Eris.CommandClient(config.token, {}, {
    description: "A test bot made with Eris",
    owner: "Xamtheking",
    prefix: ["sk ", "Sk ", "bend over and ", "Bend over and"],
    ignoreBots: true
});
const commands = {};
commands.ping = new (require('./commands/ping.js'))(bot);
commands.hug = new (require('./commands/hug.js'))(bot);

bot.on("ready", () => { // When the bot is ready
    console.log("Ready!"); // Log "Ready!"
    console.log(bot.guilds.size)
    connection.query('SELECT * from `prefix`', function(error, db, fields) {
        for (object of db) {
            bot.registerGuildPrefix(object.GuildID, object.prefix);
        }
    });

});

bot.registerCommandAlias("halp", "help"); // Alias !halp to !help

/*

bot.registerCommand('ping', msg => {
    msg.channel.createMessage('Pong!').then(m => {
        let time = m.timestamp - msg.timestamp;
        return m.edit(`Pong! **${time}**ms`);
    });
}, {
    description: "Ping",
    fullDescription: "This command tests for latency."
});
*/
bot.registerCommand("p", (msg, args) => {
    let file = fs.readFileSync('./steak.jpg');
    if (args[0] == "steak") {
        msg.channel.createMessage('', {
            file,
            name: 'steak.jpg'
        });
    } else if (args[0] == "knife") {
        file = fs.readFileSync('./knife.jpg');
        msg.channel.createMessage('', {
            file,
            name: 'knife.jpg'
        });
    } else if (args[0] == "hack") {
        msg.channel.createMessage('https://i.imgur.com/iVHfwLc.gif');

    } else if (args[0] == "ree") msg.channel.createMessage('https://cdn.discordapp.com/attachments/133441659198373889/402667691648745472/Snapchat-1199464898.jpg');
    else if (args[0] == "party") msg.channel.createMessage("https://media1.tenor.com/images/43d6b59a8559a4f84afd6c185ba4df19/tenor.gif");
}, {
    description: "Picture command!",
    fullDescription: "Looks for a picture in the storage and posts it. Current pictures are \`steak\`, \`knife\`" +
        ",\`hack\`, \`ree\`, and \`party\`",
    usage: "Usage: \`sk p knife\`",
    argsRequired: true,
    guildOnly: true
});
bot.registerCommand("kick",(msg, args) => {
    if (msg.member.permission.has("kickMembers")==true){
        try {
        bot.kickGuildMember(msg.channel.guild.id,msg.mentions[0].id,args.join(" "))

        }
        catch (error){
            msg.channel.createMessage("That didn't work!")
        }
    }
}
)
bot.registerCommand("ban",(msg, args) => {
    if (msg.member.permission.has("banMembers")==true){
        bot.banGuildMember(msg.channel.guild.id, msg.mentions[0].id, 0, args.join(" "))
    }
}
)

bot.registerCommand("clean", (msg, args) => {

    if ((msg.author.id == config.owner) || (msg.member.permission.has("banMembers") == true))
        msg.channel.getMessages(parseInt(args[0] + 1)).then(m => {
            for (let message of m) {
                if (message.author.id == bot.user.id) {
                    message.channel.deleteMessage(message.id);
                }
            }
        });
}, {
    description: "Cleanup!",
    fullDescription: "Used to cleanup only the bot's messages, requires at least Ban Member permissions",
    usage: "\`sk clean 20\`",
    deleteCommand: true,
    guildOnly: true,
    argsRequired: true
});

bot.registerCommand("purge", (msg, args) => {

    if ((msg.author.id == config.owner) || (msg.member.permission.has("banMembers") == true))
        msg.channel.purge(parseInt(args[0]) + 2)
}, {
    description: "PURGE THE WEAK!",
    fullDescription: "Purges messages, requires at least Ban Member permissions",
    usage: "\`sk purge 20\`",
    deleteCommand: true,
    guildOnly: true,
    argsRequired: true
});

bot.registerCommand("list", (msg, args) => {
    if (msg.author.id = config.owner) {
        for (var [key, value] of bot.guilds) {
            console.log(bot.guilds.get(key).name)
        }
    }
}, {
    hidden: true
})
bot.registerCommand("support", (msg, args) => {
    msg.channel.createMessage("My support server can be found at https://discord.gg/4Bk8JZs")
}, {
    description: "Get support!",
    fullDescription: "Provides an invite to the bot's support server"
})

var tagCommand = bot.registerCommand("tag", (msg, args) => {
    connection.query("SELECT * from `tags`", function(error, db, fields) {
        for (object of db) {
            if (object.tag == args[0]) msg.channel.createMessage(object.value);

        }
    });
}, {
    description: "meme picker!",
    fullDescription: "Picks a meme!",
    guildOnly: true,
    argsRequired: true
});


tagCommand.registerSubcommand("create", (msg, args) => {
    var arr1 = msg.content.split(" ");
    let arr2 = arr1.slice(4)
    connection.query("INSERT INTO tags (tag, value) VALUES (\'" + args[0] + "\', \'" + arr2.toString() + "\')"), + function(error, results, fields) {
        if (error) msg.channel.createMessage("It errored!");
    };
    msg.channel.createMessage('It worked and/or did not error!');
});

bot.registerCommand("prefix", (msg, args) => {
    if ((msg.author.id == config.owner) || (msg.member.permission.has("banMembers") == true)) {
        let postfix = args[0];
        if (postfix == "reset") {
            postfix = ["sk ", "Sk ", "bend over and ", "Bend over and"];
            bot.registerGuildPrefix(msg.channel.guild.id, postfix);
            connection.query('delete from `prefix` where guildID = ?', [msg.channel.guild.id], function(error, db, fields) {
                msg.channel.createMessage("Prefixes have been reset.");
            });
            return;
        };
        bot.registerGuildPrefix(msg.channel.guild.id, postfix);
        var sql = "INSERT INTO prefix (guildID, prefix) VALUES (?, ?)";
        var inserts = [msg.channel.guild.id, postfix];
        connection.query(sql, inserts, (error, results, fields) => {
            msg.channel.createMessage("My new prefix is " + postfix);
        })
    }
}, {
    description: "Changes the prefix!",
    fullDescription: "Changes the prefix for the server, requires at least Ban Members permission",
    usage: "\`sk prefix ^^\`",
    guildOnly: true,
    argsRequired: true
});

bot.registerCommand("r", (msg, args) => {
    try {
        let result = droll.roll(args[0]);
        if (result.rolls[0] == 1) {
            msg.channel.createMessage("You critically failed!");
        } else if (result.rolls[0] == 20) {
            msg.channel.createMessage("You critically succeeded!");
        } else {
            msg.channel.createMessage("Total rolled: " + result);
        }
    } catch (Error) {
        Raven.captureException(Error);
        msg.channel.createMessage("No borking!");
    }
}, {
    description: "Rolls dice!",
    fullDescription: "Rolls dice using the lib droll",
    usage: "Usage: \`sk r 1d20+5\` OR \`sk r 2d6\`",
    guildOnly: true,
    argsRequired: true
});

bot.registerCommand("h2b", (msg,args) =>{
    msg.channel.createMessage("Learn how to make a bot at https://discord.gg/6SXT7Rp");
},
{
    description: "Learn bots!",
    fullDescription: "Provides an invite to a server where you can learn how to make a Discord Bot"
}

);

bot.registerCommand("role", (msg, args) => {
    for (var [key, value] of msg.channel.guild.roles) {
        if (args[1] == msg.channel.guild.roles.get(key).name)
            try {
                bot.addGuildMemberRole(msg.channel.guild.id, msg.mentions[0].id, (msg.channel.guild.roles.get(key).id));
            }
        catch (DiscordRESTError) {
            msg.channel.createMessage("Something went wrong! I probably don't have permission to do this!")
        }

    }
}, {
    requirements: {
        "manageRoles": true
    },
    argsRequired: true,
    guildOnly: true,
    description: "Gives a user a role!",
    fullDescription: "Gives a user a role. Make sure the bot has the needed perms.",
    usage: "`sk role @user rolename`"
})

/*
bot.registerCommand('hug', (msg, args) => {
    if (!args[0]) msg.channel.createMessage("You need to specify someone to hug!");

    else {
        try {
            msg.channel.createMessage(msg.mentions[0].username + ", you have been hugged!\nhttps://i.imgur.com/O3f6NoJ.gif");
        } catch (Error) {
            msg.channel.createMessage("You need to mention someone to hug!");
        }
    }
}, {
    description: "Gives a user a hug!",
    fullDescription: "Provides a user with a steak-filled hug!",
    usage: "Usage: \`sk hug @xamtheking\`",
    argsRequired: true,
    guildOnly: true
});
*/
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
bot.registerCommand("eval", (msg, args) => {
    if (msg.author.id == config.owner) {
        if (args[0] == "config.token") {
            msg.channel.createMessage("I\'m not that stupid, I think.");
        } else if (args[0] == "midna") {
            msg.channel.createMessage("best girl");

        } else msg.channel.createMessage(eval(args[0]));
    }
}, {
    description: "Eval!",
    fullDescription: "For evaluating things! Owner only.",
    guildOnly: true,
    argsRequired: true,
    hidden: true
});
var echoCommand = bot.registerCommand("echo", (msg, args) => {
    if (msg.author.id !== config.owner) return; // Make an echo command
    if (args.length === 0) { // If the user just typed "!echo", say "Invalid input"
        return "Invalid input";
    }
    var text = args.join(" "); // Make a string of the text after the command label
    return text; // Return the generated string
}, {
    description: "Make the bot say something",
    fullDescription: "The bot will echo whatever is after the command label.",
    usage: "\`sk echo 12\`",
    guildOnly: true,
    argsRequired: true,
    hidden: true
});

echoCommand.registerSubcommand("reverse", (msg, args) => { // Make a reverse subcommand under echo
    if (args.length === 0) { // If the user just typed "!echo reverse", say "Invalid input"
        return "Invalid input";
    }
    var text = args.join(" "); // Make a string of the text after the command label
    text = text.split("").reverse().join(""); // Reverse the string
    return text; // Return the generated string
}, {
    description: "Make the bot say something in reverse",
    fullDescription: "The bot will echo, in reverse, whatever is after the command label.",
    usage: "\`sk echo reverse 12\`",
    guildOnly: true,
    argsRequired: true
});

echoCommand.registerSubcommandAlias("backwards", "reverse"); // Alias "!echo backwards" to "!echo reverse"

bot.connect();