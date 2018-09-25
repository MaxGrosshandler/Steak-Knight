const serv = require("../server.js"); 
let client = serv.client;
let droll = serv.droll;
let bot = serv.bot;
const guildcd = new Set();

function cap(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
async function getPlayer(id) {
    return client.query("SELECT * FROM players where player_id = $1", [id]).then(p => {
        return p.rows[0];
    })
}
async function getMonster(id) {
    return client.query("SELECT * FROM monsters where player_id = $1", [id]).then(m => {
        return m.rows[0];
    })
}
async function getItems(id) {
    return client.query("SELECT * FROM items where player_id = $1", [id]).then(i => {
        return i.rows;
    })
}
async function getClass(id) {
    return client.query("SELECT * FROM classes where player_id = $1", [id]).then(c => {
        return c.rows[0];
    })
}
async function getShop() {
    return client.query("SELECT * FROM shop").then(s => {
        return s.rows;
    })
}
async function getClassList() {
    return client.query("SELECT * FROM classlist").then(cl => {
        return cl.rows;
    })
}
async function killMonster(id) {
    return client.query("DELETE FROM monsters  where player_id = $1", [id])
}
async function killPlayer(player) {
    return client.query("UPDATE players SET player_hp = $1 where player_id = $2", [player.player_maxhp, player.player_id]);
}
async function levelUp(player) {
    return client.query("UPDATE players SET (player_xp, player_hp, player_atk, player_level, player_next_level, player_maxhp) = (0, players.player_maxhp + 10 , players.player_atk + 1, players.player_level+1, players.player_next_level + 100, players.player_maxhp+10)   where player_id = $1", [player.player_id]);
}
async function gainXP(player, value) {
    client.query("UPDATE players SET player_xp = players.player_xp + $1 where player_id = $2", [value, player.player_id]);
}
async function heal(player, value) {
    client.query("Update players set player_hp = players.player_hp + $1 where player_id = $2", [value, player.player_id])
}

function serializePlayerDescription({player, items, playerClass, name}) {
    let output = [`${name ? name + " is" : "You are"} ${player.player_level}, have ${player.player_hp} out of ${player.player_maxhp} hp, and have an attack of 2d6+${player.player_atk}.`];
    
    if (items) {
        for (const item of items) {
            if (item.item_type == "attack") {
                output.push(`You wield a mighty ${item.item_name} which does ${item.item_value} damage.`);
            }
            else if (item.item_type == "defense") {
                output.push(`At your side is your trusty ${item.item_name} which blocks ${item.item_value} damage.`);                
            }
        }
    }
    if (playerClass) {
        if (playerClass.class_type === "Attacker") {
            output.push(`Additionally, you inflict ${playerClass.class_value} extra damage thanks to your ${playerClass.class_skill}.`);
        }
        else if (playerClass.class_type === "Defender") {
            output.push(`Additionally, you block ${playerClass.class_value} extra damage thanks to your ${playerClass.class_skill}.`);
        }
    }
    output.push(""); // empty line
    output.push(`You have ${player.player_xp} xp and you hit the next level at ${player.player_next_level} xp.`);
    return output.join("\n");
}

module.exports = {
    func: async (msg, args) => {
        let player = await getPlayer(msg.author.id)
        let monster = await getMonster(msg.author.id)
        let items = await getItems(msg.author.id)
        let playerClass = await getClass(msg.author.id)
        var playerHit = 0;
        var monsterHit = 0;
        let shopItems = await getShop();
        let shopList = "";
        var attack = "";
        var defense = "";


        if (args[0] == "find") {
            let monsterName = "";
            let monsterhp = 0;
            let monsteratk = 0;
            if (typeof player == "undefined") {
                msg.channel.createMessage({ embed: { description: "You haven't started your adventure yet! Use `sk rpg`" } })

            }
            else {
                if (player.player_level > 5) {
                    monsterName = "Steakdragon"
                    monsterhp = 12 + 9 * Math.ceil(player.player_level) + 3 * Math.ceil(player.player_level)
                    monsteratk = 4 + 3 * Math.ceil(player.player_level/2)
                }
                else if (player.player_level > 2) {
                    monsterName = "Steakorc"
                    monsterhp = 11 + 7 * Math.ceil(player.player_level) + 2 * Math.ceil(player.player_level)
                    monsteratk = 3 + 2 * Math.ceil(player.player_level)
                }
                else {
                    monsterName = "Steakgoblin"
                    monsterhp = 10 + 5 * Math.ceil(player.player_level) + 1 * Math.ceil(player.player_level)
                    monsteratk = 2 + 1 * Math.ceil(player.player_level)
                }
                if (typeof monster == "undefined") {
                    client.query("INSERT INTO monsters (monster_name, monster_id, monster_level, player_id, hp,  atk ) values ($1, $2, $3, $4, $5, $6)", [monsterName, 1234, Math.ceil(player.player_level), msg.author.id, monsterhp, monsteratk])
                    monster = await getMonster(msg.author.id)
                    msg.channel.createMessage({ embed: { description: "You found a " + monster.monster_name + "! It is level " + monster.monster_level + ", has " + monster.hp + " health, and has an attack of 2d3+" + monster.atk + "." } })
                }
                else {
                    msg.channel.createMessage({
                        embed: {
                            description: "You are currently fighting a level "
                                + monster.monster_level + " " + monster.monster_name +
                                " with " + monster.hp + " hp, and  an attack of 2d3+" + monster.atk + "."
                        }
                    })
                }

            }
        }

        if (args[0] == "fight") {
            if (guildcd.has(msg.channel.id)) {
                msg.channel.createMessage("This command is on cooldown!");
            } else {
                if (typeof monster == "undefined") {
                    msg.channel.createMessage({ embed: { description: "You haven't found a monster yet! Use `sk rpg find`" } })
                    return;
                }
                else {
                    player = await getPlayer(msg.author.id)
                    monster = await getMonster(msg.author.id)
                    playerHit += droll.roll(`2d6+${player.player_atk}`).total;
                    monsterHit += droll.roll(`2d3+${monster.atk}`).total;
                    attack = "You dealt the monster " + playerHit + " damage"
                    defense = "The monster dealt you " + monsterHit + " damage"
                    items.forEach(function (item) {
                        if (item.item_type == "attack") {
                            wval = droll.roll(`${item.item_value}`).total;
                            playerHit += wval
                            attack += " with your mighty " + item.item_name + ", which contributed an extra " + wval + " damage"

                        }
                        else if (item.item_type == "defense") {
                            let sval = droll.roll(`${item.item_value}`).total;
                            monsterHit -= sval
                            defense += ", you blocked " + sval + " of it with your " + item.item_name
                        }

                    })
                    if (typeof playerClass !== "undefined") {
                        if (playerClass.class_type === "Attacker") {
                            let aval = droll.roll(`${playerClass.class_value}`).total + Math.floor(player.player_level/2);
                            playerHit += aval;
                            attack += ", and you dealt " + aval + " damage thanks to your " + playerClass.class_skill
                        }
                        else if (playerClass.class_type === "Defender") {
                            let dval = droll.roll(`${playerClass.class_value}`).total + Math.floor(player.player_level/2);
                            monsterHit -= dval;
                            defense += ", and you took " + dval + " less damage thanks to your  " + playerClass.class_skill

                        }
                    }


                    if (0 >= monster.hp - playerHit) {
                        attack = "You killed the monster! Hooray! You gained " + monster.monster_level * 20 + " xp"
                        defense = "You also gained " + monster.monster_level * 5 + " <:steak:481449443204530197>! You can check your balance with `sk currency` and see what to spend it on with `sk rpg shop` "
                        client.query("INSERT INTO currency (id, money) values ($1, $2) ON CONFLICT (id) DO UPDATE SET money = currency.money + $2 WHERE currency.id = $1", [player.player_id, monster.monster_level * 5])
                        killMonster(msg.author.id);
                        if (player.player_xp + monster.monster_level * 20 >= player.player_next_level) {
                            levelUp(player)
                            attack += "\nAlso, you leveled up! You are now level " + (player.player_level + 1)
                            if (player.player_level + 1 == 5) {
                                attack += "\nYou can now choose a class! Use `sk rpg class` to see the class list and `sk rpg class <classname>` to pick a class"
                            }
                        }

                        else {
                            gainXP(player, monster.monster_level * 20)
                        }
                        msg.channel.createMessage(
                            {
                                embed:
                                {
                                    description: attack + "!\n" + defense
                                }
                            })
                    }
                    else if (0 >= player.player_hp - monsterHit) {
                        attack = "Oh no, you were killed by the monster! You'll have to find another one to fight!"
                        defense = ""
                        killMonster();
                        killPlayer(player)
                        msg.channel.createMessage(
                            {
                                embed:
                                {
                                    description: attack + "!\n" + defense
                                }
                            })

                    }
                    else {
                        if (monsterHit < 0) monsterHit = 0;
                        client.query("UPDATE players SET player_hp = players.player_hp - $1 where player_id = $2", [monsterHit, player.player_id]);
                        client.query("UPDATE monsters SET hp = monsters.hp - $1 where player_id = $2", [playerHit, player.player_id]);
                        msg.channel.createMessage(
                            {
                                embed:
                                {
                                    description: attack + " for a total of " + playerHit + " damage!\n" + defense + " for a total of " + monsterHit + " damage!"
                                }
                            })
                    }


                }
                if (msg.channel.id !== "487793622897524736" && msg.channel.id !== "492444145726521344") {
                    guildcd.add(msg.channel.id);
                    setTimeout(() => {
                        guildcd.delete(msg.channel.id);
                    }, 4000);
                }
            }
        }
        if (args[0] == "heal") {
            let id = args[1].replace(/[^a-zA-Z0-9]/g, '');
            let player = getPlayer(id)
           
            if (typeof player !== "undefined") {
                if (playerClass.class_name == 'Priest') {
                    let amount =  droll.roll(`${playerClass.class_value}`).total;
                    let user = await bot.getRESTUser(player.player_id).then(user => {
                    return user})
                    heal(player, amount)
                    msg.channel.createMessage("You healed " +user.username + " for " + amount + " hp!")
                }
                else {
                    msg.channel.createMessage("You aren't a priest!")
                }
            }
            else {
                msg.channel.createMessage("That player doesn't exist!")
            }
        }
        if (args[0] == "class") {
            let classList = await getClassList();
            let classDisplay = "";
            if (typeof args[1] !== "undefined") {

                if (classArray.includes(cap(args[1]))) {
                    if (typeof playerClass == "undefined") {
                        if (player.player_level > 4) {
                            classList.forEach(function (c) {
                                if (c.class_name == cap(args[1])) {
                                    client.query("insert into classes (class_name, class_type, class_value, class_skill, player_id) values ($1, $2, $3, $4, $5)", [c.class_name, c.class_type, c.class_value, c.class_skill, msg.author.id])
                                    msg.channel.createMessage({ embed: { description: "You are now a " + c.class_name + "! Your class type is " + c.class_type + ", your skill die is " + c.class_value + ", and your Skill is " + c.class_skill + ", which is automatically applied whenever you fight." } })
                                }


                            })
                        }
                        else {
                            msg.channel.createMessage("You aren't Level 5 yet!")
                        }
                    }
                    else {
                        msg.channel.createMessage("You've already chosen a class!")
                    }
                }


            }
            else {
                classList.forEach(function (c) {
                    classDisplay += "Name: " + c.class_name + " | Type: " + c.class_type + " | Power: " + c.class_value + " | Skill: " + c.class_skill + "\n";

                })
                msg.channel.createMessage({
                    embed: {
                        description: classDisplay +
                            "You can choose one of these classes with `sk rpg class <classname>` if you are level 5 or higher and don't already have a class!"

                    }
                })
            }
        }
        if (args[0] == "shop") {
            shopItems.forEach(function (item) {
                shopList += item.item_name + " | Type: " + item.item_type + " | Power: " + item.item_value + " | Cost: " + item.cost + "\n";

            })
            msg.channel.createMessage({
                embed: {
                    description: shopList + "\n You can buy an item with `sk rpg buy <item>`"
                }
            })
        }
        if (args[0] == "buy") {


            let ownedItems = [];
            let items = await getItems(msg.author.id)

            items.forEach(function (item) {
                if (typeof item !== "undefined") ownedItems.push(item.item_name)

            })
            shopItems.forEach(function (item) {
                if (item.item_name == args[1].toLowerCase()) {
                    if (!(ownedItems.includes(args[1].toLowerCase()))) {
                        client.query("SELECT * from currency where id = $1", [msg.author.id]).then(cur => {
                            c = cur.rows[0]
                            if (c.money - item.cost < 0) {
                                msg.channel.createMessage({ embed: { description: "You don't have enough money to buy that!" } })
                            }
                            else {
                                if (item.item_type == "attack") {
                                    client.query("Delete from items where player_id = $1 AND item_type = 'attack'", [msg.author.id])
                                }
                                else if (item.item_type == "defense") {
                                    client.query("Delete from items where player_id = $1 AND item_type = 'defense'", [msg.author.id])
                                }
                                msg.channel.createMessage({ embed: { description: "You bought a " + item.item_name + " for " + item.cost + " <:steak:481449443204530197> !" } })
                                client.query("UPDATE currency SET money = currency.money - $2 WHERE currency.id = $1", [msg.author.id, item.cost])
                                client.query("INSERT INTO items (item_name, item_type, item_value, player_id) values ($1, $2, $3, $4)", [item.item_name, item.item_type, item.item_value, msg.author.id])

                            }


                        })


                    }
                    else {
                        msg.channel.createMessage({ embed: { description: "You already own this item!" } })
                    }

                }



            })
        }


        if (args[0] == "help") {
            msg.channel.createMessage({ embed: { description: "You can use `sk rpg` to check your stats, `sk rpg find` to find a monster to fight, and `sk rpg fight` or `srf` to fight a monster! Please use `sk rpg` first!" } });
        }
        if (args[0] == "lookup") {
            let pItems = '';
            let pClass = "none (you'll get one at level 5)";
            
            let id = args[1].replace(/[^a-zA-Z0-9]/g, '');
            let player = await getPlayer(id)
            let items = await getItems(id)
            let playerClass = await getClass(id)
            if (typeof player !== "undefined"){
                let user = await bot.getRESTUser(id);
                if (typeof user !== "undefined") {
                    if (typeof playerClass !== "undefined") {
                        pClass = playerClass.class_name
                    }

                    items.forEach(function (item) {
                        if (typeof item !== "undefined")
                            pItems += item.item_name + " | ";

                    })
                    pItems += "\n"


                    msg.channel.createMessage({
                        embed: {
                            description: serializePlayerDescription({player, items, playerClass, name: user.username})
                        }
                    })
                }
            }
            else {
                msg.channel.createMessage("That user doesn't exist in the rpg database!")
            }
            
        }
        if (args[0] == null) {
            let pItems = '';
            let pClass = "none (you can get one at level 5)";
            if (typeof player == "undefined") {
                client.query("INSERT INTO players (player_id, player_level, player_hp, player_atk, player_xp, player_next_level, player_maxhp) values ($1, $2, $3, $4, $5, $6, $7)", [msg.author.id, 1, 50, 1, 0, 100, 50])
                msg.channel.createMessage({ embed: { description: "You are level 1, have 50 hp, and have an attack of 2d6+1. You haven't done anything yet, so you have 0xp." } })
            }
            else {
                msg.channel.createMessage({
                    embed: {
                        description: serializePlayerDescription({player, items, playerClass})
                    }
                })
            }
        }
    },
    options: {
        description: "Fight some baddies for loot and glory!",
        fullDescription: "You can use `sk rpg` to check your stats, `sk rpg find` to find a monster to fight, and `sk rpg fight` to fight a monster! Please use `sk rpg` first!",
        usage: "`sk rpg`"
    },
    name: "rpg"
};
