const serv = require("../server.js");
let client = serv.client;
let awaitedMessages = serv.awaitedMessages;
async function getPlayerClue(id) {
    return client.query("SELECT * from player_clues where player_id = $1", [id]).then(p => {
        return p.rows[0];
    })
}
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
                msg.channel.createMessage("You solved nothing!")
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
async function getPlayerLocation(id) {
    return client.query("SELECT * from player_locations where player_id = $1", [id]).then(p => {
        return p.rows[0];
    })
}
async function setPlayerLocation(id, name) {
    let newLoc = await client.query("Select * from locations where location_name = $1", [name]).then(r => {
        return r.rows[0];
    })
    client.query("update player_locations set (location_name, location_description) = ($1, $2) where player_id = $3", [newLoc.location_name, newLoc.location_description, id])

}

async function setFirstLocation(id) {
    client.query("insert into player_locations (location_name, location_description, player_id) values ('The Starter Village', 'This is your quaint little village. There is not much to do around here, to be quite honest.', $1)", [id])
}
async function getLocations() {
    let newArr = [];
    let locArr = await client.query("SELECT * FROM locations").then(s => {
        return s.rows;

    })
    locArr.forEach(function (location) {
        newArr.push(location)

    })
    return newArr;
}
module.exports = {
    func: async (msg, args) => {
        let command = args[0]
        let playerClue = await getPlayerClue(msg.author.id)
        let playerLocation = await getPlayerLocation(msg.author.id)
        let locations = await getLocations();
        let locationList = "";
        let didNotMove = true;
        // ping
        if (command == null) {
            if (typeof playerLocation == "undefined"){
                setFirstLocation(msg.author.id)
                msg.channel.createMessage("Dark times have come to the city of Steakopolis."
                +" Recently, the mayor was beaten over the head with a frozen steak, and the killer wasn't found! Gasp!"
                +" It is your job as a up-and-coming detective to collect clues, talk to suspects, gather information, and ultimately"
                +" solve the case. I wish you luck, rookie. You will need it.")
            }
             

        }
        if (command == 'recap' ){
            msg.channel.createMessage("Dark times have come to the city of Steakopolis."
                +" Recently, the mayor was beaten over the head with a frozen steak, and the killer wasn't found! Gasp!"
                +" It is your job as a up-and-coming detective to collect clues, talk to suspects, gather information, and ultimately"
                +" solve the case. I wish you luck, rookie. You will need it.")
        }
        if (command == 'hint') {

            if (typeof playerClue !== "undefined") {
                msg.channel.createMessage(playerClue.clue_hint)
            }
            else {
                msg.channel.createMessage("You are no detective!")
            }
        }
        
                if (command == 'solve') {
            if (typeof playerClue !== "undefined") {
                msg.channel.createMessage("What is the answer?")
                awaitMessage(msg, msg2 => msg2.content === playerClue.clue_solution, timeout = 20000)
                .then(msg2 => {
                   msg.channel.createMessage("You solved the clue!")
                });
            }
            else {
                msg.channel.createMessage("You have nothing to solve!")
            }
        }
        
        if (command == "search") {
            if (typeof playerLocation !== "undefined") {
                msg.channel.createMessage({ embed: { title: playerLocation.location_name, description: playerLocation.location_description } })
            }
            else {
                setFirstLocation(msg.author.id)
                playerLocation = await getPlayerLocation(msg.author.id)
                msg.channel.createMessage({ embed: { title: playerLocation.location_name, description: playerLocation.location_description } })
            }
        }
        if (command == 'map') {
            console.log(locations)
            locations.forEach(function (location) {
                locationList += location.location_name + "\n";

            })
            msg.channel.createMessage({
                embed: {
                    title: "Locations",
                    description: locationList
                }
            })
        }
        if (command == "move") {
          
            for (location of locations){
                if (location.location_name === args[1]){
                setPlayerLocation(msg.author.id, args[1])
                msg.channel.createMessage("Moved to " + args[1])
                didNotMove = false;
                }
            }
            if (didNotMove) {
                msg.channel.createMessage("You didn't move anywhere! Make sure you have the name of the location exactly!")

            }
        }
    },
    options: {
        description: "Solve a mystery!",
        fullDescription: "`pink panther theme intensifies`",
        usage: "`sk clue`"
    },
    name: "clue"
};
