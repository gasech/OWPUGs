const embed = require('../utils/embeds');
const config = require('../config.json');
const fs = require('fs');

const prefix = config.prefix;

module.exports = {
	name: 'commands',
	description: 'Lists all commands for the bot.',
	execute(message, args) {
		let commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
		let commandsMessage = `**PUGs Commands**\n\n`;

		commandFiles = commandFiles.map((command) => {
			if (command.endsWith(".js")) {
				command = command.replace(".js", "");
				return command;
			}
		});

		for (let i of commandFiles) {
			const commandFile = require(`./${i}`);
			console.log(commandFile);
			commandsMessage += `**Command**: ${prefix}${commandFile.name}\n`;
			commandsMessage += `**Description**: ${commandFile.description}\n\n`;
		}

		embed.sendMessage(message, `${commandsMessage}`);
	},
};