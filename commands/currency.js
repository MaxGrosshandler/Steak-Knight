const serv = require("../server.js");
let client = serv.client;
let bot = serv.bot;
module.exports = {
  func: async (msg, args) => {
    if (args[0] == "c"){
        const text = "INSERT INTO currency (id, money) VALUES($1, $2) ON CONFLICT (id) DO NOTHING";
        const vals = [msg.author.id, 0];
        
        client
          .query(text, vals)
          .then(res => {
            msg.channel.createMessage("Your account has been made/refreshed!")
            console.log(res)
          }
        )
          .catch(e => console.error(e.stack));
  
    }
    else if (args[0] == "add" && process.env.ids.includes(msg.author.id)){
        let values = [];
        values[0] = msg.mentions[0].id
        values[1] = args[2]

        client.query("INSERT INTO currency (id, money) values ($1, $2) ON CONFLICT (id) DO UPDATE SET money = currency.money + $2 WHERE currency.id = $1", values).then(result =>{
            msg.channel.createMessage("Added " + args[2] + " steaks into the account of " + msg.mentions[0].username)
            
              })
              
            }
            else if (args[0] == "remove" && process.env.ids.includes(msg.author.id)){
                let values = [];
                values[0] = msg.mentions[0].id
                values[1] = args[2]
        
                client.query("UPDATE currency SET money = currency.money - $2 WHERE currency.id = $1", values).then(result =>{
                    msg.channel.createMessage("Removed " + args[2] + " steaks from the account of " + msg.mentions[0].username)
                    
                      })
                      
                    }
            

    },
    options: {
        description: "snakes",
        fullDescription:
          "fall down",
        usage: "die"
      },
      name: "currency"
    };