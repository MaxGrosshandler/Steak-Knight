
const serv = require("../server.js");
let sf = serv.sf;
module.exports = {
  func: async (msg) => {
    let steak;

    try {
        await sf
            .get("https://www.reddit.com/r/steak/search.json?q=self%3Ano+&restrict_sr=on&include_over_18=on&sort=relevance&t=all")
            .then(s => steak = s.body)
            console.log
        msg.channel.createMessage({embed: {
            title: steak.children[parseInt(Math.random()* 50)].steak.data,
            url:(recipe.hits[parseInt(Math.random()* 50)].recipe.url),
            description: "",
            thumbnail:{
                url: recipe.hits[parseInt(Math.random()* 50)].recipe.image
            }
        }
        
    } 
)
            
    } catch (err) {
        console.error(err);
    }
},
  options: {
    description: "Steak pictures!",
    fullDescription: "Provides a random steak picture!",
    usage: "`sk steak`"
  },
  name: "steak"
};
