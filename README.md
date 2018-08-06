# Steak Knight

Thanks for looking at my bot!
Let me show you around.

# Dependencies

You've got a few of these bad boys to install via npm or your preferred package manager.
Eris, fs, snekfetch (soon to be replaced), pg

# What is this help me

This is a Discord bot (which I'm sure you know, but you gotta be positive) written in Javascript that uses the Eris library.
The other popular library is Discord.js, which I personally don't like, but whatever floats your boat.

# HOW MAKE IT SPEAK WORD

Woah there! If you want to try to get up and running as soon as possible, follow these steps:

1.  Make sure [Node](https://nodejs.org/en/) is installed (either version is fine)
2.  Make sure [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) is installed (to clone the repo)
3.  In terms of dependencies, only install Eris and fs if you want to go fast
4.  Git clone the repository
5.  comment out any lines relating to postgres or snekfetch, because those require a bit more work to set up
6.  Also, make sure to generate a config.json file with these properties:
    id (your id)
    altid (this is for when I'm using my alt, just set this to an empty string if you don't have an alt you are using this with)
    token (because you don't want to put your token in the main file)
7.  node app.js
8.  good job

# For a more thorough install

1.  Make sure [Node](https://nodejs.org/en/) is installed (either version is fine)
2.  Make sure [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)is installed
3.  install all the dependencies as listed above
4.  Git clone the repository
5.  Alright, postgres stuffs. You can adjust the name of the database to your liking, but make sure to reflect that in app.js. The schema I use is:
    TABLE prefixes with COLUMNS id (varchar 25) and list (varchar 25)
    TABLE bottles with COLUMN id (varchar 25)
6.  Also, I like using pm2 to keep my bot up, but use what you like. Screen or tmux also work.
7.  Make sure you have a config.json file made with the following:
    id (your id)
    altid (if you have an alt you use this bot with, leave it as an empty string if this doesn't apply)
    token (because you don't want your token in the main file)
8.  even better job

If you run into issues installing, please yell at me at Xamtheking#2099 or MaxGrosshandler#6592
