global.config = require("./config.json");
var Raven = require("raven");
Raven.config(config.ravenConfig).install();
const Eris = require("eris");
const fs = require("fs");
var pm2 = require("pm2");
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

var bot = new Eris.CommandClient(
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
var commandNames = [];
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

bot.on("messageCreate", msg => {
  if (msg.content == "Who is undeniably the best girl?") {
    msg.channel.createMessage("Midna is the best girl.");
  }
});
client.query("SELECT * FROM prefixes").then(res => {
  for (item of res.rows) {
    console.log(item);
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
bot.registerCommand(
  "p",
  (msg, args) => {
    let file = fs.readFileSync("./pictures/steak.jpg");
    if (args[0] == "steak") {
      msg.channel.createMessage("", {
        file,
        name: "steak.jpg"
      });
    } else if (args[0] == "knife") {
      file = fs.readFileSync("./pictures/knife.jpg");
      msg.channel.createMessage("", {
        file,
        name: "knife.jpg"
      });
    } else if (args[0] == "hack") {
      try {
        msg.channel.createMessage({
          embed: {
            image: {
              url: "https://i.imgur.com/iVHfwLc.gif"
            }
          }
        });
      } catch (Error) {
        msg.channel.createMessage("Something went wrong");
      }
    } else if (args[0] == "ree") {
      try {
        msg.channel.createMessage({
          embed: {
            image: {
              url:
                "https://cdn.discordapp.com/attachments/133441659198373889/402667691648745472/Snapchat-1199464898.jpg"
            }
          }
        });
      } catch (Error) {
        msg.channel.createMessage("Something went wrong");
      }
    } else if (args[0] == "party") {
      try {
        msg.channel.createMessage({
          embed: {
            image: {
              url:
                "https://media1.tenor.com/images/43d6b59a8559a4f84afd6c185ba4df19/tenor.gif"
            }
          }
        });
      } catch (Error) {
        msg.channel.createMessage("Something went wrong");
      }
    }
  },
  {
    description: "Picture command!",
    fullDescription:
      "Looks for a picture in the storage and posts it. Current pictures are `steak`, `knife`" +
      ",`hack`, `ree`, and `party`",
    usage: "Usage: `sk p knife`",
    argsRequired: true,
    guildOnly: true
  }
);

//thanks wolke

bot.registerCommand("prefix", (msg, args) => {
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
      console.log(res.rows[0]);
    })
    .catch(e => console.error(e.stack));
});

var prof = bot.registerCommand("profile", (msg, args) => {
  var profCheck = false;
  const plquery = {
    // give the query a unique name
    name: "fetch-profile",
    text: "SELECT * FROM profiles"
  };
  client.query(plquery).then(res => {
    for (item of res.rows) {
      if (item.id == args[0]) {
        msg.channel.createMessage(
          "Profile found! \nThe user is called " + item.name
        );
        profCheck = true;
        return;
      }
    }
    if (profCheck == false) {
      msg.channel.createMessage("Profile not found.");
    }
  });
});

prof.registerSubcommand("create", async (msg, args) => {
  const pcquery = {
    name: "create-profile",
    text: "INSERT INTO profiles(id, name) VALUES ($1, $2) RETURNING *",
    values: [msg.author.id, msg.author.username]
  };
  try {
    let res = await client.query(pcquery);
    await msg.channel.createMessage("Profile created.");
    console.log(res.rows[0]);
  } catch (e) {
    console.error(e.stack);
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
//below made by ratismal, the best boi
bot.registerCommand(
  "eval",
  async (msg, args) => {
    if (msg.author.id == config.id) {
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

var bottle = bot.registerCommand(
  "bottle",
  (msg, args) => {
    if (args[0] == "opt-in") {
      const bolText = "INSERT INTO bottles(id) VALUES($1) RETURNING *";
      const bolVals = [msg.author.id];
      client
        .query(bolText, bolVals)
        .then(res => {
          msg.channel.createMessage("Opted into bottles!");
          console.log(res.rows[0]);
        })
        .catch(e => console.error(e.stack));
    }
    if (args[0] == "opt-out") {
      const bdText = "DELETE FROM bottles where id = $1";
      var bdVals = [msg.author.id];
      client
        .query(bdText, bdVals)
        .then(res => {
          msg.channel.createMessage("Opted out of bottles.");
          console.log(res.rows[0]);
        })
        .catch(e => console.error(e.stack));
    }
  },
  {}
);
bottle.registerSubcommand("send", (msg, args) => {
  var names = [];
  var send = false;
  client.query("SELECT * FROM bottles").then(res => {
    for (item of res.rows) {
      names.push(item.id);
    }
    console.log(names);
    var dmID = names[Math.floor(Math.random() * names.length)];
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
        bot.createMessage(result.id, args.join(" "));
      });
    }
  });
});

bot.connect();
module.exports = bot;
