const serv = require("../server.js");
let sh = serv.sh;
module.exports = {
  func: async (msg, args) => {
    sh.getRandom({type: args[0], nsfw: false, filetype: "gif"}).then(array => {

        try {
        msg.channel.createMessage({
            embed: {
                description: msg.mentions[0].username + ", you have been affected by a  " + args[0]+"!",
                image: {
                    url: array.url
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
})
},
  options: {
    description: "weeb.sh",
    fullDescription: "don't actually use this",
    usage: "`why are you here`",
    hidden: true
  },
  name: "weeb"
};
