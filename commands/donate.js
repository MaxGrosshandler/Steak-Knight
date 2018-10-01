//provides a link to my paypal!
module.exports = {
  func: async (msg, args) => {
    msg.channel.createMessage(
      "If you want to help speed up development and make me feel like I'm worth something," +
      "\nplease consider donating to me at https://www.paypal.me/MaxGrosshandler. Every little bit is appreciated."
    );
  },

  options: {
    description: "Donate to the creator!",
    fullDescription: "Provides my paypal.me link.",
    usage: "`sk donate`"
  },
  name: "donate"
};
