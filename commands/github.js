module.exports = {
  func: async (msg, args) => {
    msg.channel.createMessage(
      "https://github.com/MaxGrosshandler/Steak-Knight"
    );
  },

  options: {
    description: "See the codebase!",
    fullDescription: "Spits out a link to my github!",
    usage: "`sk github`"
  },
  name: "github"
};
