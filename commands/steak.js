const serv = require("../server.js")
const Bing = serv.Bing;
module.exports = {
  func: async (msg) => {
    Bing.images("Filet Mignon", {count: 50}, function(error, res, body){
        msg.channel.createMessage({
            embed: {
                image:{
                    url: body.value[parseInt(Math.random()* 50)].contentUrl
                } 
            }
        });
    });
},
  options: {
    description: "Steak pics!",
    fullDescription: "Returns a picture of a steak!",
    usage: "`sk steak`"
  },
  name: "steak"
};
