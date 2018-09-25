module.exports = {
  func: async (msg) => {
        msg.channel.createMessage({
          embed: {
            image: {
              url: "https://media.giphy.com/media/9UyZI216ic5vG/giphy.gif"
            }
          }
        });
    // so on and so forth
  },
  options: {
    description: "Gives a hug!",
    fullDescription: "Provides a steak-filled hug!",
    usage: "Usage: `sk hug"
  },
  name: "hug"
};