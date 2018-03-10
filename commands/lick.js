const snekfetch = require('snekfetch');
module.exports = {


  func: async (msg, args) => {
    // checks for mention
    if (!args[0]) msg.channel.createMessage("You need to specify someone to lick!");
 
    else { // licks the user
        try {
            snekfetch.get('https://rra.ram.moe/i/r?type=lick').then(res => {
                let url = 'https://rra.ram.moe' + res.body.path;
                //msg.channel.createMessage(msg.mentions[0].username + ", you have been licked! "+url+"\npowered by weeb.sh")
                msg.channel.createMessage(
                    {
                        content: msg.mentions[0].username + ", you have been licked! ",
                        embed: {
                       image: {
                           url: url
                       },
                       footer:{
                        text: "powered by weeb.sh"
                       } 
                    }
                })
        });
        } catch (Error) {
            msg.channel.createMessage("You need to mention someone to lick!");
        }
}
    // so on and so forth
  },
  options: 
  {
    description: "Licks a user!",
    fullDescription: "Provides a user with a lick!",
    usage: "Usage: \`sk lick @xamtheking\`",
    argsRequired: true,
    guildOnly: true
  },
  name: "lick"
}