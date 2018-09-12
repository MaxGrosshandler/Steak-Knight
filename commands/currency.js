const serv = require("../server.js");
let client = serv.client;

let bot = serv.bot;
module.exports = {
  func: async (msg, args) => {
    if (args[0] == "add" && process.env.ids.includes(msg.author.id)){
    if (!isNaN(args[2])){
        let values = [];
        let id = args[1].replace(/[^a-zA-Z0-9]/g, '');
        values[0] = id
        values[1] = args[2]

        client.query("INSERT INTO currency (id, money) values ($1, $2) ON CONFLICT (id) DO UPDATE SET money = currency.money + $2 WHERE currency.id = $1", values).then(result =>{
            msg.channel.createMessage("Added " + args[2] + " <:steak:481449443204530197> to " + msg.mentions[0].username)
            
              })
              
            }
            else {
                msg.channel.createMessage("That isn't a number!")
            }
    }
            else if (args[0] == "remove" && process.env.ids.includes(msg.author.id) ){
                if (!isNaN(args[2])){
                let values = [];
                let id = msg.mentions[0].id.replace(/[^a-zA-Z0-9]/g, '');
                values[0] = id
                values[1] = args[2]
                let snakes = [];
                snakes[0] = id
                client.query("SELECT * from currency WHERE id = $1", snakes).then(result => {
                    if ( values[1] > result.rows[0].money ){
                        msg.channel.createMessage("Not enough <:steak:481449443204530197>  in account!")
                        return;
                    }
                    else{
                        client.query("UPDATE currency SET money = currency.money - $2 WHERE currency.id = $1", values).then(result =>{
                            msg.channel.createMessage("Removed " + args[2] + " <:steak:481449443204530197>  from the account of " + msg.mentions[0].username)
                            
                              })
                    }
                })
                }
                else {
                    msg.channel.createMessage("That isn't a number!")
                }
        
                
                      
                    }
            else if (args[0] == "give" ){
                if(!isNaN(args[2])){
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
                    if (typeof result.rows[0] == "undefined"){
                        msg.channel.createMessage("You have no <:steak:481449443204530197> to give! You can get some with `sk currency daily`")
                        return;
                    }
                    else if ( values[1] > result.rows[0].money )
                    {
                        msg.channel.createMessage("You don't have that many <:steak:481449443204530197> to give!")
                        return;
                    }
                


                    else {
                        client.query("INSERT INTO currency (id, money) values ($1, $2) ON CONFLICT (id) DO UPDATE SET money = currency.money + $2 WHERE currency.id = $1",values).then(result => {
                        })
                        client.query("UPDATE currency SET money = currency.money - $2 WHERE currency.id = $1", snakes).then(rob =>
                            {
                            msg.channel.createMessage("Gave " + args[2] + " <:steak:481449443204530197> to " + msg.mentions[0].username)
                            }
                        )
                        }
                }

                )}
   else {
    msg.channel.createMessage("That isn't a number!")
    
   } }

                    else if (args[0] == null){
                        let spoop = [];
                        spoop[0] = msg.author.id
                        client.query("SELECT * FROM currency where id = $1",spoop).then(result => {
                            if (typeof result.rows[0] == "undefined"){
                                msg.channel.createMessage("You have no <:steak:481449443204530197> ! You can get some with `sk currency daily`")
                            }
                            else {
                                msg.channel.createMessage("You have " + result.rows[0].money+ " <:steak:481449443204530197>")
                            }
                        })

                    }
                    else if (args[0] == "daily"){
                        let values = [];
                        let id = msg.author.id
                        values[0] = id
                        let spoop = [];
                        spoop[0] = id;
                        values[1] = 50

                        client.query("SELECT * FROM WAITING WHERE id = $1", spoop).then(result =>{
                            if (typeof result.rows[0] == "undefined"){
                                client.query("INSERT INTO currency (id, money) values ($1, $2) ON CONFLICT (id) DO UPDATE SET money= currency.money + $2 WHERE currency.id = $1", values).then(result =>{
                                    msg.channel.createMessage("You got your daily 50 <:steak:481449443204530197> !")
                                    
                                      })
                                client.query("INSERT INTO waiting (id) values ($1)", spoop)
        
                            }
                            else {
                                msg.channel.createMessage("You already claimed your daily steaks today!")
                            }
                        })


                    }
            


                },

                    
    options: {
        description: "Currency system!",
        fullDescription:
          "Jumping off point for currency.",
        usage: "`sk currency give @user <amount>` to give another user some steaks, `sk currency` to check your balance, and `sk currency daily` to get your daily 50 steaks!"
      },
      name: "currency"
    };