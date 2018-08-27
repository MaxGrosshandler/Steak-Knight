const serv = require("../server.js");
let sh = serv.sh;
module.exports = {
  func: async (msg) => {
    sh.getRandom({type: "slap", nsfw: false, filetype: "gif"}).then(array => {

        try {
        msg.channel.createMessage({
            embed: {
                description: msg.mentions[0].username + ", you have been slapped!",
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
    description: "Slaps a user!",
    fullDescription: "Gives a user a slap!",
    usage: "`sk slap @user`"
  },
  name: "slap"
};
