const config = require("./config.json");
var program = require('commander');
var Raven = require('raven');
const Cryptr = require('cryptr')
cryptr = new Cryptr('myTotallySecretKey');
Raven.config(config.ravenConfig).install();
const Eris = require("eris");
const fs = require("fs");
var bot = new Eris.CommandClient(config.token, {}, {
    description: "A test bot made with Eris",
    owner: "Xamtheking",
    prefix: ["sk ", "Sk ", "bend over and ", "Bend over and"],
    ignoreBots: true
});
//much thanks to jtsshieh and DAPI in general
fs.readdir('./commands', (err, files) => {
    if (err) console.error(err);
    console.log(`Attempting to load a total of ${files.length} commands into the memory.`, false);
    files.forEach(file => {
      try {
        const command = require(`./commands/${file}`);
        console.log(`Attempting to load the command "${command.name}".`, false);
        bot.registerCommand(command.name,command.func, command.options);
      }
      catch (err) {
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

bot.registerCommandAlias("halp", "help");
var cryptoCommand = bot.registerCommand("crypto", (msg, args) =>{



}
)
cryptoCommand.registerSubcommand("e", (msg, args) =>{
msg.channel.createMessage(cryptr.encrypt(args.join(" ")))
}
)
cryptoCommand.registerSubcommand("d", (msg, args) =>{
    msg.channel.createMessage(cryptr.decrypt(args.join(" ")))
}
)
/*
program
  .version('0.1.0')
  .option('-p, --peppers', 'Add peppers')
  .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
  .parse(process.argv);
 
console.log('you ordered a pizza with:');
if (program.peppers) console.log('  - peppers');
console.log('  - %s cheese', program.cheese);
/*
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
*/
bot.registerCommand("list", (msg) =>{
for (item of bot.guilds){
    console.log(item.name)
}


}
)
bot.registerCommand("invite", (msg, args) => {
    msg.channel.createMessage("Invite me with <https://discordapp.com/api/oauth2/authorize?client_id=397898847906430976&permissions=-1&scope=bot>")
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



/*
bot.registerCommand("eval", (message, args) => {

/*function codeBlock(code) {
    if(!lang) lang = "";
    return `\n\`\`\`${lang}\n${content}\n\`\`\``;
}

let guild = message.channel.guild, channel = message.channel, author = message.author, member = message.member;
try {
    let output = eval(`(async function(){${message.args[0].replace(/“|”/g, "\"")}}).call()`);
    output = util.inspect(output, { depth: 0 }).substring(0, 1900);
    return `**Out:** ${(output, "js")}`;
} catch(error) {
    console.log(error)
    return `**Error:** ${(error, "js")}`;
}
}
)
*/


var echoCommand = bot.registerCommand("echo", (msg, args) => {
    if (msg.author.id !== config.id) return; // Make an echo command
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