

  module.exports = {
    func: async (msg, args) => {
      await msg.channel.createMessage('Pong!').then(m => {
        let time = m.timestamp - msg.timestamp;
        return m.edit(`Pong! **${time}**ms`);
    });
    },
    options: {},
    name: "ping"
}