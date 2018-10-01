//this command is used for determing the shard of a given server
const bi = require('big-integer')
module.exports = {
  func: async (msg, args) => {
    let n = bi(args[0]).shiftRight(22)
    msg.channel.createMessage("Shard is " + n.mod(256).toString())
  },
  options: {
    description: "You shouldn't see this",
    fullDescription: "Gives a shard for gnar",
    usage: "`sk gnar <serverid>`"
  },
  name: "gnar"
};
