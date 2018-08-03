const snekfetch = require('snekfetch');
module.exports = {


  func: async (msg, args) => {
    let words = msg.content.split(/\s+/);
    if (!words[2]) msg.channel.createMessage("You need to specify someone to cuddle!");
    else { // cuddles the user
        try {
            snekfetch.get('https://rra.ram.moe/i/r?type=cuddle').then(res => {
                let url = 'https://rra.ram.moe' + res.body.path;
                msg.channel.createMessage(
                    {
                        content: msg.mentions[0].username + ", you have been cuddled! ",
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
            msg.channel.createMessage("You need to mention someone to cuddle!");
        }
}
    // so on and so forth
  },
  options: 
  {
    description: "Cuddles a user!",
    fullDescription: "Provides a user with a cuddle!",
    usage: "Usage: \`sk cuddle @xamtheking\`",
    argsRequired: true,
    guildOnly: true
  },
  name: "cuddle"
}