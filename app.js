global.config = require("./config.json");
let Raven = require("raven");
Raven.config(config.ravenConfig).install();
const Eris = require("eris");
const fs = require("fs");
let pm2 = require("pm2");
const sf = require("snekfetch");
const { Client } = require("pg");
const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "mydb",
  password: "basic",
  port: 5432
});
client.connect();

let bot = new Eris.CommandClient(
  config.token,
  {},
  {
    description: "Steak Knight: A bot for all your steak needs!",
    owner: "Xamtheking#2099",
    prefix: ["sk ", "Sk "],
    ignoreBots: true,
    defaultHelpCommand: true
  }
);
global.bot = bot;
let commandNames = [];
//much thanks to jtsshieh and DAPI in general
fs.readdir("./commands", (err, files) => {
  files.forEach(file => {
    try {
      const command = require(`./commands/${file}`);
      console.log(`Attempting to load the command "${command.name}".`, false);
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

bot.on("ready", () => {
  console.log("Ready!");
  console.log(bot.guilds.size);
  postStats();
  bot.editStatus("online", { name: "sk help" });
});
let huntIDs = [];
let casting = false;
let index = 0;
let freqOn = true;
bot.on("messageReactionAdd", (message, emoji, userID) => {
  if (huntIDs.includes(message.id) && userID !== "397898847906430976") {
    message.channel.createMessage(
      "Congratulations, <@" + userID + "> won the hunt!"
    );
    index = huntIDs.indexOf(message.id);
    delete huntIDs[index];
  }
});

bot.on("messageCreate", msg => {
  if (msg.content == "Who is undeniably the best girl?") {
    msg.channel.createMessage("Midna is the best girl.");
  }
  if (
    msg.content == "spellbound" &&
    (msg.author.id == config.id || msg.author.id == config.altid)
  ) {
    casting = true;
    msg.channel.createMessage("Spellbook opened.");
  }
  if (
    msg.content == "starstruck" &&
    (msg.author.id == config.id || msg.author.id == config.altid)
  ) {
    casting = false;
    msg.channel.createMessage("Spellbook closed.");
  }
  if (
    msg.content == "eris" &&
    casting &&
    (msg.author.id == config.id || msg.author.id == config.altid)
  ) {
    msg.channel.createMessage("https://abal.moe/Eris/");
  }
  if (
    msg.content == "frequency" &&
    casting &&
    (msg.author.id == config.id || msg.author.id == config.altid)
  ) {
    freqOn = !freqOn;
    msg.channel.createMessage("Switch flipped.");
  }
});

client.query("SELECT * FROM prefixes").then(res => {
  for (item of res.rows) {
    bot.registerGuildPrefix(item.id, item.list);
  }
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

//thanks wolke

bot.registerCommand("prefix", (msg, args) => {
  if (
    msg.author.id == "107563269484490752" ||
    msg.author.id == "195156669108322313" ||
    msg.member.permission.has("banMembers") == true
  ) {
    const text = "INSERT INTO prefixes(id, list) VALUES($1, $2) RETURNING *";
    const values = [msg.channel.guild.id, args[0]];
    if (args[0] == "reset") {
      const delText = "DELETE FROM prefixes WHERE ID = $1";
      const delVals = [values[0]];
      client
        .query(delText, delVals)
        .then(res => {
          bot.registerGuildPrefix(msg.channel.guild.id, ["sk ", "Sk "]);
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
});

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

bot.registerCommand(
  "hunt",
  (msg, args) => {
    msg.channel.getMessage(args[0]).then(function(result) {
      huntIDs.push(result.id);
      let hint = args.slice(1).join(" ");
      msg.channel.addMessageReaction(result.id, "🍖");
      msg.channel.createMessage("The hunt is on!\nThe hint is: " + hint);
    });
  },
  {}
);
//below made by ratismal, the best boi
bot.registerCommand(
  "eval",
  async (msg, args) => {
    if (msg.author.id == config.id || msg.author.id == config.altid) {
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

let bottle = bot.registerCommand(
  "bottle",
  (msg, args) => {
    if (args[0] == "opt-in") {
      const idText = "DELETE FROM bottles where id = $1";
      let idVals = [msg.author.id];
      client
        .query(idText, idVals)
        .then(res => {
          console.log(res.rows[0]);
        })
        .catch(e => console.error(e.stack));

      const bolText = "INSERT INTO bottles(id) VALUES($1) RETURNING *";
      const bolVals = [msg.author.id];
      //let i;
      //  for (i = 0; i < 3; i++) {
      client
        .query(bolText, bolVals)
        .then(res => {
          console.log(res);
        })
        .catch(e => console.error(e.stack));
      //  }

      msg.channel.createMessage(
        "Opted into bottles! You can now send and receive bottles. Use `sk bottle send <your message here>` to send your first bottle. \nDisclaimer: I do not check for content (please submit PRs to help fix), so be wary and keep your NSFW filters on if you so desire. Happy bottling!"
      );
    }
    if (args[0] == "opt-out") {
      const bdText = "DELETE FROM bottles where id = $1";
      let bdVals = [msg.author.id];
      client
        .query(bdText, bdVals)
        .then(res => {
          msg.channel.createMessage(
            "Opted out of bottles. You will no longer receive or be able to send any bottles."
          );
        })
        .catch(e => console.error(e.stack));
    }
  },
  {
    description: "Main bottle command!",
    fullDescription:
      "Use this command to either opt into or out of bottles, or to send as a subcommand.",
    usage: "`sk bottle opt-in` or `sk bottle opt-out`"
  }
);
bottle.registerSubcommand(
  "send",
  (msg, args) => {
    let names = [];
    let send = false;
    let invite = true;
    client.query("SELECT * FROM bottles").then(res => {
      for (item of res.rows) {
        names.push(item.id);
      }
      let dmID = names[Math.floor(Math.random() * names.length)];
      do {
        dmID = names[Math.floor(Math.random() * names.length)];
      } while (dmID == msg.author.id);
      for (item of res.rows) {
        if (msg.author.id == item.id) {
          send = true;
        }
      }

      if (send) {
        bot.getDMChannel(dmID).then(function(result) {
          if (result.id !== msg.author.id) {
            try {
              bot.createMessage(
                result.id,
                "**You got a bottle:** " + args.join(" ")
              );
              msg.channel.createMessage("Message sent!");
            } catch (e) {
              console.log(e);
              msg.channel.createMessage("Message not sent for some reason.");
            }
          }
        });
      } else {
        msg.channel.createMessage(
          "You aren't on the bottle list so you can't send messages!"
        );
      }
    });
  },
  {
    description: "Send a message in a bottle!",
    fullDescription:
      "Sends a message to a user on the bottles list, requires sender to also be on bottles list.",
    usage: "sk bottle send <your message here>",
    cooldown: 20000,
    cooldownMessage: "You're using this too fast!"
  }
);
/*
bottle.registerSubcommand("frequency", msg => {
  if (freqOn) {
    const freText = "INSERT INTO bottles(id) VALUES($1) RETURNING *";
    const freVals = [msg.author.id];
    client
      .query(freText, freVals)
      .then(res => {
        console.log(res);
        msg.channel.createMessage(
          "Frequency of bottles increased! If you abuse this while it's a WIP I might ban you from bottles permanently, so please be thoughtful."
        );
      })
      .catch(e => console.error(e.stack));
  } else {
    msg.channel.createMessage("Disabled for right now.");
  }
});
*/
bot.connect();
module.exports = { bot };
