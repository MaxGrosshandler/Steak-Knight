//this command goes back in time!
const serv = require("../server.js");
const sf = serv.sf;
module.exports = {
  func: async (msg, args) => {
    let m = await msg.channel.createMessage("Spinning up the Wayback Machine...")
          try {
        await sf.get("http://timetravel.mementoweb.org/api/json/2016/"+args[0], {redirect:true} ).then(result => {
                return m.edit("The Wayback Machine spat this out: <" +result.body.mementos.first.uri[0]+">");
        })
    }
    catch (err){
        return m.edit("The Wayback Machine couldn't find anything! Make sure it's a valid url!")
    }
},
  options: {
    description: "Wayback Machine!",
    fullDescription: "Go back in time! You can find the earliest known snapshot of a website by putting in a url!",
    usage: "`sk wayback <url>`"
  },
  name: "wayback"
};
