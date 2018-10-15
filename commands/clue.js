const serv = require("../server.js");
let client = serv.client;
async function getPlayerClue(id) {
    return client.query("SELECT * from player_clues where player_id = $1", [id]).then(p => {
        return p.rows[0];
    })
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
            msg.channel.createMessage("You are a sleuth indeed!")
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
                if (playerClue.clue_solution == args[1]) {
                    msg.channel.createMessage("You've cracked the case!")
                }
                else {
                    msg.channel.createMessage("You need more evidence!")
                }
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
