const config = require('./config.json');
require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');
const embed = require('./embeds');

const client = new Discord.Client();
client.commands = new Discord.Collection();

let pugState = {
	acceptMatchPeriod: false,
	pugsRunning: true,
	teams: [["", "", "", "", "", ""], ["", "", "", "", "", ""]],
	maps: require('./maps.json'),
	pickedMap: "",
	messageTeamOneId: "",
	messageTeamTwoId: ""
}

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const prefix = config.prefix;

client.on("message", message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
	
	if (!client.commands.has(command)) return embed.sendReply(message, 'This command does not exist, please type **pugs!help** to see the full list of commands.');

	try {
		client.commands.get(command).execute(message, args, pugState);
	} catch (error) {
		console.error(error);
		embed.sendReply(message, 'there was an error trying to execute that command!');
	}
});

client.login(process.env.TOKEN);

client.once('ready', () => {
	console.log('OWPugs is ready for usage.');
});