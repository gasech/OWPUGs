const config = require('../config.json');
const fs = require('fs');
const embed = require('../embeds');
const maps = require('../maps.json');

module.exports = {
	name: 'pickup',
	description: 'Pickup players from voice channel and sends message with teams',
	execute(message, args) {
		if (!message.member.voice.channel) return embed.sendReply(message, `You cannot start picking up players since you are not in a voice channel.`);
		const voiceInfo = message.member.voice.channel.members.array();
		if (voiceInfo.length <= 0) return embed.sendReply(message, `You need atleast 12 players to start the PUG.`);

		let players = getJsonPlayers(); // JSOn

		console.log(players);

		voiceInfo.map((voiceUser) => {
			const playerName = voiceUser.nickname ? voiceUser.nickname : voiceUser.user.username;
			const playerRoles = getPlayerRoles(message, voiceUser);
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

const getJsonPlayers = () => {
	let players;

	try {
		const data = JSON.parse(fs.readFileSync('./players.json', 'utf8'));
		players = data;
	} catch (err) {
		console.error(err)
	}

	return players;
}

const setJsonPlayers = (players) => {
	try {
		const data = fs.writeFileSync('./players.json', JSON.stringify(players, null, 2))
	} catch (err) {
		console.error(err)
	}
}