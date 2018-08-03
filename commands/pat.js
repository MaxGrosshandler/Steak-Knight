const snekfetch = require('snekfetch');
module.exports = {


  func: async (msg, args) => {
    // checks for mention
    let words = msg.content.split(/\s+/);
    if (!words[2]) msg.channel.createMessage("You need to specify someone to pat!");
 
    else { // patss the user
        try {
            snekfetch.get('https://rra.ram.moe/i/r?type=pat').then(res => {
                let url = 'https://rra.ram.moe' + res.body.path;
                msg.channel.createMessage(
                    {
                        content: msg.mentions[0].username + ", you have been given pats! ",
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
            msg.channel.createMessage("You need to mention someone to pat!");
        }
}
    // so on and so forth
  },
  options: 
  {
    description: "Pats a user!",
    fullDescription: "Provides a user with a pat!",
    usage: "Usage: \`sk pat @xamtheking\`",
    argsRequired: true,
    guildOnly: true
  },
  name: "pat"
}