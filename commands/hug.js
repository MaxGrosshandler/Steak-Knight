module.exports = {
  func: async (msg, args) => {
    // checks for mention
    let words = msg.content.split(/\s+/);
    if (!words[2])
      msg.channel.createMessage("You need to specify someone to hug!");
    else {
      // hugs the user
      try {
        msg.channel.createMessage({
          content: msg.mentions[0].username + ", you have been hugged! ",
          embed: {
            image: {
              url: "https://media.giphy.com/media/9UyZI216ic5vG/giphy.gif"
            }
          }
        });
      } catch (Error) {
        msg.channel.createMessage("You need to mention someone to hug!");
      }
    }
    // so on and so forth
  },
  options: {
    description: "Gives a user a hug!",
    fullDescription: "Provides a user with a steak-filled hug!",
    usage: "Usage: `sk hug @user`"
  },
  name: "hug"
};
