const embed = require('../utils/embeds');
const config = require('../config.json');

module.exports = {
	name: 'reply',
	description: 'reply test embed',
	execute(message, args) {
    embed.sendReply(message, args[0]);
	},
};