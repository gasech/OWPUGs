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
			let players = readPlayersJson();
			const serverID = message.guild.id;
			
			let roleList = {
				MainTank: [],
				OffTank: [],
				DPSHitscan: [],
				DPSFlex: [],
				FlexSupport: [],
				MainSupport: []
			};

			voiceInfo.forEach((voiceUser) => {
				const playerID = voiceUser.id;
				const playerName = voiceUser.nickname ? voiceUser.nickname : voiceUser.user.username;
				const playerRoles = getPlayerRoles(message, voiceUser);

				const indexUser = players.findIndex(player => player.user_id === playerID && player.server_id === serverID);
				// If not found returns -1
				const notFound = -1; // Made a const for better understanding of the code

				if (indexUser != notFound) {
					players[indexUser].name = playerName;
					players[indexUser].roles = playerRoles;
					players[indexUser].active = true;
				} else {
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

			roleList = splitRoles(players, roleList); 
			players = makeAllInactive(players); // Makes all players inactive again
			writePlayersJson(players); // Writes over players.json file
			chooseMap(message); // Chooses the map
		} catch (err) {
			console.log(err);
		}
	},
};

const getPlayerRoles = (message, voiceUser) => {
	const roles = [];

	voiceUser._roles.forEach((roleId) => {
		const role = message.guild.roles.cache.find(r => r.id === roleId)
		if (["Main Tank", "Off Tank", "DPS Flex", "DPS Hitscan", "Main Support", "Flex Support"].includes(role.name)) {
			roles.push(role.name);
		}
	});

	return roles;
}

const readPlayersJson = () => {
	let players;

	try {
		const data = JSON.parse(fs.readFileSync('./players.json', 'utf8'));
		players = data;
	} catch (err) {
		console.error(err)
	}

	return players;
}

const writePlayersJson = (players) => {
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

const splitRoles = (players, roleList) => {
	players.forEach((player) => {
		if (!player.active) return;
		player.roles.forEach((role) => {
			role = role.replace(" ","");
			roleList[role].push(player.name);
		});
	});

	return roleList;
}

const chooseMap = (message) => {
	embed.sendMap(message, maps[Math.floor(Math.random() * maps.length)]);
};