const serv = require("../server.js");
let sf = serv.sf;
const config = require("../config.json")
module.exports = {
  func: async (msg) => {
    let recipe;
    let reStr = "**INGREDIENTS**";

    try {
        await sf
            .get("https://api.edamam.com/search?app_id=c7c6731b&app_key=" +config.recipe+"&q=steak&from=0&to=50")
            .then(r=> recipe = r.body)
            for (item of recipe.hits[parseInt(Math.random()* 50)].recipe.ingredientLines){
                reStr += "\n*"+item
            }
        msg.channel.createMessage({embed: {
            title: recipe.hits[parseInt(Math.random()* 50)].recipe.label,
            url:(recipe.hits[parseInt(Math.random()* 50)].recipe.url),
            description: reStr,
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
    description: "Steak recipes!",
    fullDescription: "Provides a random steak recipe!",
    usage: "`sk recipe`"
  },
  name: "recipe"
};
