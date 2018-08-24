const serv = require("../server.js");
let client = serv.client;
let bot = serv.bot;
module.exports = {
  func: async (msg, args) => {

    // prefix should be 0, invoke should be 1

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
        "Opted into bottles! You can now send and receive bottles. You can use either `sk bottle send <message>` or `sbs <message>` to send your first bottle. \nIf you get a bottle that contains advertisements or prohibited content, please DM Xamtheking#2099 or MaxGrosshandler#6592 so I can take care of the issue. Happy bottling!"
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
          let colorPrefix = "```";
          let colorSuffix = "```";
          let name = "a random user";
          let nameCheck = true;
          bot.getDMChannel(dmID).then(function(result) {
            args.shift();
            if (args[0] == null) {
              msg.channel.createMessage("You gotta send a message, breh!");
              return;
            }
            if ((args[0] == "sign" || args[0] == "s") && nameCheck){
              args.shift();
              name = msg.author.username + "#" + msg.author.discriminator;
              nameCheck = false;
            }
            if (args[0] == "color"){
              args.shift()
              if (args[0] == "bash" || args[0] == "b"){
                args.shift()
                colorPrefix = "```bash\n"
              }
              else if (args[0] == "css" || args[0] == "c") {
                args.shift()
                colorPrefix = "```css\n"
              }
              else if (args[0] == "prolog" || args[0] == "p") {
                args.shift()
                colorPrefix = "```prolog\n"
              }
              }
              if ((args[0] == "sign" || args[0] == "s") && nameCheck){
                args.shift();
                name = msg.author.username + "#" + msg.author.discriminator;
                nameCheck = false;
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
                bot.createMessage(
                  result.id,
                  "**You got a bottle:** \n"+colorPrefix + args.join(" ")+colorSuffix + "\nSent by: "+name
                );
                msg.channel.createMessage("Message sent!");
                let report =
                  "Sent by: " +
                  msg.author.id +
                  "\nRecieved By: " +
                  dmID +
                  "\nContent: " +
              colorPrefix + args.join(" ") + colorSuffix
              + "\nIdentity of user to sender: " + name

                bot.createMessage("481255776644497423", report);
              } catch (e) {
                console.log(e);
                msg.channel.createMessage("Message not sent for some reason.");
              }
            }
          });
        } else {
          msg.channel.createMessage(
            "You aren't on the bottle list so you can't send messages! You can join the list with `sk bottle opt-in` or `sboi` "
          );
        }
      });
    }
  },
  options: {
    description: "Main bottle command!",
    fullDescription:
      "Use this command to opt-in or opt-out of bottles, or to send a bottle.",
    usage:
      "`sk bottle opt-in` or `sboi`, `sk bottle opt-out` or `sboo`,`sk bottle send <yourmessagehere>` or `sbs <message>"
  },
  name: "bottle"
};
