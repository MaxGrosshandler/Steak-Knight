const serv = require('../server.js')
var awaitedMessages = serv.awaitedMessages;
function awaitMessage(msg, callback, timeout = 300000) {
    return new Promise((resolve, reject) => {
        /* Verify the contents of the object */
        if (!awaitedMessages[msg.channel.id])
            awaitedMessages[msg.channel.id] = {};

        /* Create an optional timeout */
        let timer;
        if (timeout >= 0) {
            timer = setTimeout(function() {
                delete awaitedMessages[msg.channel.id][msg.author.id];
                msg.channel.createMessage("You didn't give an age!")
            }, timeout);
        }
        
        /* Check for an existing entry, and remove if neccesary */
        if (awaitedMessages[msg.channel.id][msg.author.id]) {
            awaitedMessages[msg.channel.id][msg.author.id].reject();   
        }
        
        /* Create an empty entry for the user, overwriting any old one */
        awaitedMessages[msg.channel.id][msg.author.id] = {
            /* Resolving function */
            resolve: function(msg2) {
                clearTimeout(timer);
                resolve(msg2);
            },
            /* Rejecting function */
            reject: function() {
                clearTimeout(timer);
                reject(new Error('Request was overwritten'));
            },
            callback
        };
    });
}
    module.exports = {
  func: async (msg) => {
    msg.channel.createMessage("How old are you?")
    awaitMessage(msg, msg2 => isNaN(msg2.content) === false, timeout = 20000)
    .then(msg2 => {
       msg.channel.createMessage("Ok, you are "+ msg2.content + " years old.")
    });
},
  options: {
    description: "Find out how old you are!",
    fullDescription: "Asks the user how old they are",
    usage: "`sk age`"
  },
  name: "age"
};
