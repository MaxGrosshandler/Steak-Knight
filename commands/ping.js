module.exports = {
  func: async (msg) => {
    // ping
    await msg.channel.createMessage("Pong!").then(m => {
      let time = m.timestamp - msg.timestamp;
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
