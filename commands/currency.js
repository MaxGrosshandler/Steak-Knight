const serv = require("../server.js");
let client = serv.client;

let bot = serv.bot;
module.exports = {
  func: async (msg, args) => {
    if (args[0] == "add" && process.env.ids.includes(msg.author.id)){
        let values = [];
        let id = msg.mentions[0].id.replace(/[^a-zA-Z0-9]/g, '');
        values[0] = id
        values[1] = args[2]

        client.query("INSERT INTO currency (id, money) values ($1, $2) ON CONFLICT (id) DO UPDATE SET money = currency.money + $2 WHERE currency.id = $1", values).then(result =>{
            msg.channel.createMessage("Added " + args[2] + " steaks into the account of " + msg.mentions[0].username)
            
              })
              
            }
            else if (args[0] == "remove" && process.env.ids.includes(msg.author.id) ){
                let values = [];
                let id = msg.mentions[0].id.replace(/[^a-zA-Z0-9]/g, '');
                values[0] = id
                values[1] = args[2]
                let snakes = [];
                snakes[0] = id
                client.query("SELECT * from currency WHERE id = $1", snakes).then(result => {
                    if ( values[1] > result.rows[0].money ){
                        msg.channel.createMessage("not enough steaks in account!")
                        return;
                    }
                    else{
                        client.query("UPDATE currency SET money = currency.money - $2 WHERE currency.id = $1", values).then(result =>{
                            msg.channel.createMessage("Removed " + args[2] + " steaks from the account of " + msg.mentions[0].username)
                            
                              })
                    }
                })
        
                
                      
                    }
            else if (args[0] == "give"){
                let values = [];
                let id = msg.mentions[0].id.replace(/[^a-zA-Z0-9]/g, '');
                values[0] = id
                values[1] = args[2]
                let snakes = [];
                snakes[0] = msg.author.id;
                let spoop = [];
                spoop[0] = msg.author.id
                snakes[1] = args[2];
                client.query("SELECT * from currency WHERE id = $1", spoop).then(result => {
                    if ( values[1] > result.rows[0].money )
                    {
                        msg.channel.createMessage("not enough steaks in account!")
                        return;
                    }

                    else {
                        client.query("INSERT INTO currency (id, money) values ($1, $2) ON CONFLICT (id) DO UPDATE SET money = currency.money + $2 WHERE currency.id = $1",values).then(result => {
                            console.log(result)
                        })
                        client.query("UPDATE currency SET money = currency.money - $2 WHERE currency.id = $1", snakes).then(rob =>
                            {
                            msg.channel.createMessage("Gave " + args[2] + " steaks to " + msg.mentions[0].username)
                            }
                        )
                        }

                    })}

                    else if (args[0] == null){
                        let spoop = [];
                        spoop[0] = msg.author.id
                        client.query("SELECT * FROM currency where id = $1",spoop).then(result => {
                            if (typeof result.rows[0] == "undefined"){
                                msg.channel.createMessage("You have no steaks!")
                            }
                            else {
                                msg.channel.createMessage("You have " + result.rows[0].money+ " steaks")
                            }
                        })

                    }
                    else if (args[0] == daily){
                        let values = [];
                        let id = msg.mentions[0].id.replace(/[^a-zA-Z0-9]/g, '');
                        values[0] = id
                        values[1] = args[2]
                
                        client.query("INSERT INTO currency (id, money) values ($1, $2) ON CONFLICT (id) DO UPDATE SET money = currency.money + $2 WHERE currency.id = $1", values).then(result =>{
                            msg.channel.createMessage("Added " + args[2] + " steaks into the account of " + msg.mentions[0].username)
                            
                              })
                    }
            


                },

                    
    options: {
        description: "Get steaks!",
        fullDescription:
          "Jumping off point for currency.",
        usage: "`sk currency give @user <amount>` or `sk currency bal`"
      },
      name: "currency"
    };