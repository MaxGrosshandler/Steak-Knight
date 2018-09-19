const Endpoints = require('eris/lib/rest/Endpoints');
const serv = require ("../server.js")
const bot = serv.bot;
//all this is straight from ratismal he is the best boy
//please give him pats
module.exports = {
  func: async (msg, args) => {
    if (msg.member.permission.has("kickMembers") == true) {
    let time = parseInt(args[0]);
    args.shift();
        if (isNaN(time)) time = 0;
        let channel = msg.channel.id;
        time = Math.min(time, 120);
        
        const endpoint = Endpoints.CHANNEL(channel)
        try {
            await bot.requestHandler.request('PATCH', endpoint, true, {
                rate_limit_per_user: time,
                reason: args.join(" ")
            });

            let out = ':ok_hand: ';
            if (time === 0) out += 'Slowmode has been disabled.';
            else out += `Slowmode has been set to 1 message every **${time} seconds**.`;
            msg.channel.createMessage(out)
        } catch (err) {
           msg.channel.createMessage("I don't have perms!")
        }
    }
    else {
        msg.channel.createMessage("You need at least kickMembers to use this command!")
    }

},
  options: {
    description: "Slowmode!",
    fullDescription: "Turns on slowmode for the channel, between 1 message per second and 1 message per 120 seconds.",
    usage: "`sk slowmode <amount> <reason>`"
  },
  name: "slowmode"
};
