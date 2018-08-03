

const droll = require('droll');

module.exports = {
    func:
     async (msg, args) => {
        try {
            // rolls the dice
              let result = droll.roll(args[0]);
                  msg.channel.createMessage("Total rolled: " + result);
          } catch (Error) {
              // for catching errors w sentry
              Raven.captureException(Error);
              msg.channel.createMessage("No borking!");
          }
      },
      options:
      {
        description: "Rolls dice!",
        fullDescription: "Rolls dice using the lib droll",
        usage: "Usage: \`sk r 1d20+5\` OR \`sk r 2d6\`",
        guildOnly: true,
        argsRequired: true
      },
      name: "r"
    
};