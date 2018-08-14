const serv = require("../server.js");
let client = serv.client;
let bot = serv.bot;
module.exports = {
  func: async (msg, args) => {
    if (args[0] == "opt-in") {
      const idText = "DELETE FROM bottles where id = $1";
      let idVals = [msg.author.id];
      client
        .query(idText, idVals)
        .then(res => {
          console.log();
        })
        .catch(e => console.error(e.stack));

      const bolText = "INSERT INTO bottles(id) VALUES($1) RETURNING *";
      const bolVals = [msg.author.id];
      //let i;
      //  for (i = 0; i < 3; i++) {
      client
        .query(bolText, bolVals)
        .then(res => {
          console.log();
        })
        .catch(e => console.error(e.stack));
      //  }

      msg.channel.createMessage(
        "Opted into bottles! You can now send and receive bottles. Use `sk bottle send <your message here>` to send your first bottle. \nIf you get a bottle that contains advertisements or prohibited content, please DM Xamtheking#2099 or MaxGrosshandler#6592 so I can take care of the issue. Happy bottling!"
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
    let names = [];
    let send = false;
    let invite = true;
    if (args[0] == "send") {
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
            if (args[0] == null) {
              msg.channel.createMessage("You gotta send a message, breh!");
              return;
            }
            args.shift();
            let str = args.join(" ");
            let invite = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/g;
            if (invite.test(str)) {
              msg.channel.createMessage(
                "No putting invites in bottles! This isn't an advertising service!"
              );
              return;
            }
            if (result.id !== msg.author.id) {
              try {
                bot.createMessage(
                  result.id,
                  "**You got a bottle:** " + args.join(" ")
                );
                msg.channel.createMessage("Message sent!");
                let report =
                  "Sent by: " +
                  msg.author.id +
                  "\nRecieved By: " +
                  dmID +
                  "\nContent: " +
                  args.join(" ");
                bot.createMessage("476118129806671882", report);
              } catch (e) {
                console.log(e);
                msg.channel.createMessage("Message not sent for some reason.");
              }
            } else {
              msg.channel.createMessage(
                "You aren't on the bottle list so you can't send messages! You can join the list with `sk bottle opt-in`"
              );
            }
          });
        }
      });
    }
  },
  options: {
    description: "Main bottle command!",
    fullDescription:
      "Use this command to opt-in or opt-out of bottles, or to send a bottle.",
    usage:
      "`sk bottle opt-in`, `sk bottle opt-out`, or `sk bottle send <yourmessagehere>`"
  },
  name: "bottle"
};
