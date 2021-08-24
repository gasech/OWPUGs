const config = require('../config.json');
const fs = require('fs');
const embed = require('../embeds');
const maps = require('../maps.json');

module.exports = {
	name: 'pickup',
	description: 'Pickup players from voice channel and sends message with teams',
	execute(message, args) {
		try {
			if (!message.member.voice.channel) return embed.sendReply(message, `You cannot start picking up players since you are not in a voice channel.`);
			const voiceInfo = message.member.voice.channel.members.array();
			if (voiceInfo.length <= 0) return embed.sendReply(message, `You need atleast 12 players to start the PUG.`);
			let players = getJsonPlayers();
			console.log("Validating Players:");
			const serverID = message.guild.id;

			voiceInfo.map((voiceUser) => {
				const playerID = voiceUser.id;
				const playerName = voiceUser.nickname ? voiceUser.nickname : voiceUser.user.username;
				const playerRoles = getPlayerRoles(message, voiceUser);

				const indexUserID = players.findIndex(player => player.user_id === playerID);
				const indexServerID = players.findIndex(player => player.server_id === serverID);
				const notFound = -1; // If not found returns -1

				if (indexUserID != notFound && indexServerID != notFound) {
					console.log(`Found in Server and User: ${playerName}`);
					players[indexUserID].name = playerName;
					players[indexUserID].roles = playerRoles;
					players[indexUserID].active = true;
				} else {
					console.log(`Not found in Server and User: ${playerName}`);
					players.push({
						user_id: playerID,
						server_id: serverID,
						name: playerName,
						roles: playerRoles,
						wins: 0,
						losses: 0,
						matches_without_playing: 0,
						active: true
					});
				}
			});

			players = makeAllInactive(players);
			setJsonPlayers(players);
			chooseMap(message);
		} catch (err) {
			console.log(err);
		}
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
		fs.writeFileSync('./players.json', JSON.stringify(players, null, 2))
	} catch (err) {
		console.error(err)
	}
}

const makeAllInactive = (players) => {
	players.map((player) => {
		player.active = false;
		return player;
	});

	return players;
}