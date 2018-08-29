const serv = require("../server.js");
let weebSH= serv.weebSH;
module.exports = {
  func: async (msg, args) => {
   try { weebSH.toph.getRandomImage(args[0]).then( image => {

        try {
        msg.channel.createMessage({
            embed: {
                image: {
                    url: image.url
                },
                footer:{
                    text: "Powered by weeb.sh"
                } 

            }
        });
    }
    
    catch (err){
        msg.channel.createMessage("You didn't mention anyone!")
    }
   }).catch(console.log(""))
}
  catch(err){
      console.log("");
  }
},
  options: {
    description: "weeb.sh",
    fullDescription: "don't actually use this",
    usage: "`why are you here`",
    hidden: true
  },
  name: "weeb"
};
