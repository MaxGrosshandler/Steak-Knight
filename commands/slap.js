const snekfetch = require('snekfetch');
module.exports = {


  func: async (msg, args) => {
    let words = msg.content.split(/\s+/);
    if (!words[2]) msg.channel.createMessage("You need to specify someone to slap!");
 
    else { // slaps the user
        try {
            snekfetch.get('https://rra.ram.moe/i/r?type=slap').then(res => {
                let url = 'https://rra.ram.moe' + res.body.path;
                msg.channel.createMessage(
                    {
                        content: msg.mentions[0].username + ", you have been slapped! ",
                        embed: {
                       image: {
                           url: url
                       },
                       footer:{
                        text: "Powered by weeb.sh"
                       } 
                    }
                })
        });
        } catch (Error) {
            msg.channel.createMessage("You need to mention someone to slap!");
        }
}
    // so on and so forth
  },
  options: 
  {
    description: "Slaps a user!",
    fullDescription: "Provides a user with a good whack!",
    usage: "Usage: \`sk slap @xamtheking\`",
    argsRequired: true,
    guildOnly: true
  },
  name: "slap"
}