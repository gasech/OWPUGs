require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();

client.login(process.env.TOKEN);

client.once('ready', () => {
    console.log('OWPugs is ready for usage.');
});

