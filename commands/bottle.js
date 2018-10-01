//messages in a bottle!
const serv = require("../server.js");
let client = serv.client;
let bot = serv.bot;
module.exports = {
  func: async (msg, args) => {


    if (args[0] == "opt-in") {
      let exists = await client.query("Select from bottle where id = $1", [msg.author.id])
      if (typeof exists.rows[0] !== "undefined") {
        msg.channel.createMessage("You are already on the bottle list!")
      }
      else {
        client.query("INSERT INTO bottle(id) VALUES($1)", [msg.author.id])
        msg.channel.createMessage(
          "Opted into bottles! You can now send and receive bottles. You can use either `sk bottle send <message>` or `sbs <message>` to send your first bottle. \nIf you get a bottle that contains advertisements or prohibited content, please DM Xamtheking#2099 or MaxGrosshandler#6592 so I can take care of the issue. Happy bottling!"
        );
      }

    }
    if (args[0] == "opt-out") {
      client.query("delete from bottle where id = ($1)", [msg.author.id])
      msg.channel.createMessage(
        "Opted out of bottles. You will no longer receive or be able to send any bottles."
      )
    }
    if (args[0] == "help") {
      msg.channel.createMessage({
        embed: {
          description: "Be on the bottle list to send and receive random messages from other users on the bottle list!"
            + "\nHow to use: `sk bottle opt-in` or `sboi` to opt into the bottle list, `sk bottle opt-out` or `sboo` to opt out of the bottle list, and `sk bottle send <yourmessagehere>` or `sbs <yourmessagehere>` to send a message to someone on the bottle list! You can also include attachments, but no invite links."
            + "\nAdditionally, you can use `sk bottle send sign <yourmessagehere>` or `sbss <yourmessagehere>` to send the bottle and let "
            + "the recipient know who sent it!"
        }
      })
    }
    if (args[0] == "stats") {
      client.query("SELECT * from bottle_stats").then(result => {
        msg.channel.createMessage({
          embed:
          {
            description: "I've sent " + result.rows[0].bottlenumber + " bottles"
          }
        })
      })

    }
    let names = [];
    let send = false;
    if (args[0] == "send") {
      client.query("SELECT * FROM bottle").then(res => {
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

          let name = "a random user";
          let attach = "no attachment";
          bot.getDMChannel(dmID).then(function (result) {
            args.shift();
            if (args[0] == null) {
              msg.channel.createMessage("You gotta send a message, breh!");
              return;
            }

            if (args[0] == "sign") {
              args.shift();
              name = msg.author.username + "#" + msg.author.discriminator;
            }




            let str = args.join(" ");
            let invite = /(?:discord(?:(?:.|.?dot.?)(?:gg|me|li|to|io)|app(?:.|.?dot.?)com\/invite)|(invite|disco)(?:.|.?dot.?)gg)\/[\da-z]+/gim;
            if (invite.test(str)) {
              msg.channel.createMessage(
                "No putting invites in bottles! This isn't an advertising service!"
              );
              return;
            }
            if (result.id !== msg.author.id) {
              try {
                if (typeof msg.attachments[0] !== 'undefined') {
                  attach = msg.attachments[0].url
                  bot.createMessage(
                    result.id,

                    {
                      embed: {
                        description: "**You got a bottle:** \n" + args.join(" ") + "\nSent by: " + name,
                        image: {
                          url: msg.attachments[0].url
                        }
                      }
                    }

                  );
                }
                else {
                  bot.createMessage(
                    result.id,

                    {
                      embed:
                      {
                        description: "**You got a bottle:** \n" + args.join(" ") + "\nSent by: " + name
                      }
                    }
                  );
                }
                client.query("update bottle_stats set bottlenumber = bottle_stats.bottlenumber + 1")
                msg.channel.createMessage("Message sent!");
                let report =
                  "Sent by: " +
                  msg.author.id +
                  "\nRecieved By: " +
                  dmID +
                  "\nContent: " +
                  args.join(" ")
                  + "\nIdentity of sender: " + name
                  + "\nAttachment: " + attach

                bot.createMessage("481255776644497423", {
                  embed: {
                    description: report
                  }

                });
              } catch (e) {
                console.log(e);
                msg.channel.createMessage("Message not sent!");
              }
            }
          });
        } else {
          msg.channel.createMessage(
            "You aren't on the bottle list so you can't send messages! You can join the list with `sk bottle opt-in` or `sboi`, or use `sk bottle help` for more info"
          );
        }
      });
    }
  },
  options: {
    description: "Main bottle command, used as a launching point",
    fullDescription:
      "Use this command to opt-in or opt-out of bottles, or to send a bottle. It now supports attachments!",
    usage:
      "`sk bottle opt-in` or `sboi`, `sk bottle opt-out` or `sboo`,`sk bottle send <yourmessagehere>` or `sbs <message>`"
      + "\nAdditionally, you can use `sk bottle send sign <yourmessagehere>` or `sbss <yourmessagehere>` to send the bottle and let"
      + "the recipient know who sent it!"
  },
  name: "bottle"
};
