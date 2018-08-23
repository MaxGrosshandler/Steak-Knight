module.exports = {
  func: async (msg) => {
    // ping
    let d1 = new Date().getTime();
    await msg.channel.createMessage("Pong!").then(m => {
      let d2 = new Date().getTime();
      let time = d2 - d1;
      return m.edit(`Pong! **${time}**ms`);
    });
  },
  options: {
    description: "Ping!",
    fullDescription: "Returns the bot's latency!",
    usage: "`sk ping`"
  },
  name: "ping"
};
