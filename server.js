var express = require("express");
var app = express();
const fs = require("fs");
const Eris = require("eris");
const commands = require("./commands");
const sf = require("snekfetch");
var pg = require("pg");
var cf_app = require("./app/vcap_application");
var cf_svc = require("./app/vcap_services");
var config = require("./config.json");
var bot = new Eris.CommandClient(
  config.token,
  {},
  {
    description: "A bot for all your steak needs!",
    owner: "Xamtheking#2099 and MaxGrosshandler#6592",
    prefix: ["sk ", "Sk "],
    defaultHelpCommand: false
  }
);

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
    `Attempting to load a total of ${files.length} commands into the memory.`,
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
  /*
  if (msg.content.startsWith(config.prefix)) {
    let args = msg.content.split("config.prefix");
    let command = args[1].toLowerCase();
    let commandFile = require(`./commands/${command}.js`);
    let snake = commandFile.func(msg, args).then(result => {
      msg.channel.createMessage(result);
    });
  }
  */
});
bot.registerCommand(
  "github",
  msg => {
    msg.channel.createMessage(
      "https://github.com/MaxGrosshandler/Steak-Knight"
    );
  },
  {
    description: "See my codebase!"
  }
);
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
bot.registerCommand(
  "invite",
  (msg, args) => {
    msg.channel.createMessage(
      "Invite me with <https://discordapp.com/api/oauth2/authorize?client_id=397898847906430976&permissions=0&scope=bot>"
    );
  },
  {
    description: "Invite the bot to your server!"
  }
);
let str = "";
bot.registerCommand("help", (msg, args) => {
  if (typeof args[0] == "undefined") {
    helpCommands.forEach(cmd => {
      str += "sk " + cmd[0] + " - " + cmd[1] + "\n";
    });
    str += "";
    msg.channel.createMessage(str);
    str = "";
  } else if (typeof args[0] !== "undefined") {
    let cmd;
    helpCommands.forEach(c => {
      if (c[0] == args[0]) {
        cmd = c;
        console.log(cmd);
        return;
      }
    });
    if (typeof cmd !== "undefined") {
      msg.channel.createMessage(
        "**" + cmd[0] + "**\n" + cmd[2] + "\n" + cmd[3]
      );
    }
  }
});
bot.registerCommand(
  "donate",
  (msg, args) => {
    msg.channel.createMessage(
      "If you want to help speed up development and make me feel like I'm worth something," +
        "\nplease consider donating to me at https://www.paypal.me/MaxGrosshandler. Every little bit is appreciated."
    );
  },
  {
    description: "Donate to the bot's creator!"
  }
);
/*
bot.registerCommand(
  "prefix",
  (msg, args) => {
    if (
      msg.author.id == "195156669108322313" ||
      msg.member.permission.has("banMembers") == true
    ) {
      const text = "INSERT INTO prefixes(id, list) VALUES($1, $2) RETURNING *";
      const values = [msg.channel.guild.id, args[0]];
      if (args[0] == "") {
        msg.channel.createMessage("You need to have a prefix!");
        return;
      }
      if (args[0] == "reset") {
        const delText = "DELETE FROM prefixes WHERE ID = $1";
        const delVals = [values[0]];
        client
          .query(delText, delVals)
          .then(res => {
            bot.registerGuildPrefix(msg.channel.guild.id, [
              "paladin ",
              "Paladin "
            ]);
            msg.channel.createMessage("Your prefix has been reset.");
            console.log("prefixes deleted successfully");
          })
          .catch(e => console.error(e.stack));
        return;
      }
      client
        .query(text, values)
        .then(res => {
          bot.registerGuildPrefix(msg.channel.guild.id, args[0]);
          msg.channel.createMessage("Your new prefix is " + args[0]);
        })
        .catch(e => console.error(e.stack));
    } else {
      msg.channel.createMessage("You don't got perms!");
    }
  },
  {
    description: "Prefix management",
    fullDescription: "Set or reset a custom prefix",
    usage: "`sk prefix customprefix` and `customprefix reset`"
  }
);
*/
bot.connect();
bot.on("ready", () => {
  console.log("Ready!");
  console.log(bot.guilds.size);
  postStats();
  bot.editStatus("online", { name: "sk help" });
});

bot.registerCommand(
  "eval",
  async (msg, args) => {
    if (config.ids.includes(msg.author.id)) {
      let toExecute;
      let code = args.join(" ");
      if (code.split("\n").length === 1)
        toExecute = eval(`async () => ${code}`);
      else toExecute = eval(`async () => { ${code} }`);
      toExecute.bind(this);
      try {
        msg.channel.createMessage(await toExecute());
      } catch (err) {
        msg.channel.createMessage(err.stack);
      }
    }
  },
  {
    description: "Eval!",
    fullDescription: "For evaluating things! Owner only.",
    guildOnly: true,
    argsRequired: true,
    hidden: true
  }
);
var echoCommand = bot.registerCommand(
  "echo",
  (msg, args) => {
    // Make an echo command
    if (args.length === 0) {
      // If the user just typed "!echo", say "Invalid input"
      return "Invalid input";
    }
    var text = args.join(" "); // Make a string of the text after the command label
    return text; // Return the generated string
  },
  {
    description: "Make the bot say something",
    fullDescription: "The bot will echo whatever is after the command label.",
    usage: "<text>"
  }
);

echoCommand.registerSubcommand(
  "reverse",
  (msg, args) => {
    // Make a reverse subcommand under echo
    if (args.length === 0) {
      // If the user just typed "!echo reverse", say "Invalid input"
      return "Invalid input";
    }
    var text = args.join(" "); // Make a string of the text after the command label
    text = text
      .split("")
      .reverse()
      .join(""); // Reverse the string
    return text; // Return the generated string
  },
  {
    description: "Make the bot say something in reverse",
    fullDescription:
      "The bot will echo, in reverse, whatever is after the command label.",
    usage: "<text>"
  }
);
module.exports.client = client;
module.exports.bot = bot;
echoCommand.registerSubcommandAlias("backwards", "reverse"); // Alias "!echo backwards" to "!echo reverse"

app.set("views", __dirname + "/views");
app.set("view engine", "jade");
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res) {
  res.render("pages/index", {
    app_environment: app.settings.env,
    application_name: cf_app.get_app_name(),
    app_uris: cf_app.get_app_uris(),
    app_space_name: cf_app.get_app_space(),
    app_index: cf_app.get_app_index(),
    app_mem_limits: cf_app.get_app_mem_limits(),
    app_disk_limits: cf_app.get_app_disk_limits(),
    service_label: cf_svc.get_service_label(),
    service_name: cf_svc.get_service_name(),
    service_plan: cf_svc.get_service_plan()
  });
});
app.listen(process.env.PORT || 4000);
