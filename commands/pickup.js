const embed = require('../embeds');
const config = require('../config.json');
const maps = require('../maps.json');

module.exports = {
	name: 'pickup',
	description: 'Pickup players from voice channel and sends message with teams',
	execute(message, args) {
		if (!message.member.voice.channel) return embed.sendReply(message,`You cannot start picking up players since you are not in a voice channel.`);
		const voiceInfo = message.member.voice.channel.members.array();
		if(voiceInfo.length <= 0) return embed.sendReply(message,`You need atleast 12 players to start the PUG.`);
		voiceInfo.map((voiceUser) => {
			const playerName = voiceUser.nickname ? voiceUser.nickname : voiceUser.user.username;
			const playerRoles = getPlayerRoles(message, voiceUser);

			console.log(`Name: ${playerName}`);
			console.log(`Roles: ${playerRoles}`);
		});
		
		chooseMap(message);
	},
};

const chooseMap = (message) => {
	embed.sendMap(message, maps[Math.floor(Math.random() * maps.length)]);
};

const getPlayerRoles = (message, voiceUser) => {
	const roles = [];
	
	voiceUser._roles.map((roleId) => {
		const role = message.guild.roles.cache.find(r => r.id === roleId)
		if (["Main Tank", "Off Tank", "DPS Flex", "DPS Hitscan", "Main Support", "Flex Support"].includes(role.name)) {
			roles.push(role.name);
		}
	});

	return roles;
}