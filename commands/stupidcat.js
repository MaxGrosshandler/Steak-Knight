const serv = require("../server.js");
const bot = serv.bot;

// sc note: have a pool of messages, evenly balanced between positive and negative. expand as desired
const messages = [
  // positives
  'stupid cat is an adorable and cute ball of fur',
  'stupid cat is very cute',
  'stupid cat is great',
  // negatives
  'stupid cat is awful awful garbage',
  'stupid cat was a mistake',
  'stupid cat is worthless'
]

/**
 * Sleeps for the provided number of milliseconds
 */
function sleep(time = 1000) {
  return new Promise(res => {
    setTimeout(res, time);
  });
}

/**
 * Gets a random int between min (inclusive) and max (exclusive)
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * max) + min; 
}

module.exports = {
  func: async (msg, args) => {
    let m = await msg.channel.createMessage("<a:loading:393852367751086090> Seaching for information about **stupid cat#8160**...");
    // get a random message from the pool
    let message = messages[getRandomInt(0, messages.length)];
    // get a random number of milliseconds, between 5s and 10s
    let timeout = getRandomInt(2500, 5000);
    await sleep(timeout);
    return m.edit(message);
  },

  options: {
    description: "Tells you about stupid cat",
    fullDescription: "Tells you about stupid cat",
    usage: "`sk stupidcat`"
  },
  name: "stupidcat"
};
