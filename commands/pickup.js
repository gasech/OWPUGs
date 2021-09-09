const config = require('../config.json');
const embed = require('../embeds');
const editJSON = require('../jsonEditor');

module.exports = {
	name: 'pickup',
	description: 'Pickup players from voice channel and sends message with teams',
	execute(message, args, pugState) {
		if (!message.member.voice.channel) return embed.sendReply(message, `You cannot start picking up players since you are not in a voice channel.`);
		const voiceInfo = message.member.voice.channel.members.array();
		if (voiceInfo.length <= 0) return embed.sendReply(message, `You need atleast 12 players to start the PUG.`);
		let players = editJSON.readPlayers();
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

		players.forEach((player) => {
			if (!player.active) return;
			player.roles.forEach((role) => {
				role = role.replace(" ", "");
				if (checkAvoided(player)) {
					for (let i = 0; i < config.chanceOfJoining; i++) {
						roleList[role].push(player.name);
					}
				} else {
					roleList[role].push(player.name);
				}
			});
		});

		Object.keys(roleList).forEach((key) => {
			for (let i = 0; i < 2; i++) {
				const pickedPlayer = roleList[key][Math.floor(Math.random() * roleList[key].length)];
				deleteFromRolesList(pickedPlayer, roleList);
			}
		});

		pugState.pugsRunning = true;

		players = makeAllInactive(players);
		editJSON.writePlayers(players);
		chooseMap(message, pugState);
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

const makeAllInactive = (players) => { // Makes all players inactive again
	players.map((player) => {
		player.active = false;
		return player;
	});
	return players;
}

const chooseMap = (message, pugState) => {
	if (pugState.maps.length == 0) {
		resetMaps(message, pugState);
	} else {
		const pickedNumber = Math.floor(Math.random() * pugState.maps.length)
		const pickedMap = pugState.maps[pickedNumber].name;
		embed.sendMap(message, pugState.maps[pickedNumber]);
		deleteMapFromList(pickedMap, pugState);
		console.log(pugState.maps);
	}
}

const deleteMapFromList = (pickedMap, pugState) => {
	for (let i = pugState.maps.length; i--;) {
		if (pugState.maps[i].name == pickedMap) pugState.maps.splice(i, 1);
	}
}

const resetMaps = (message, pugState) => {
	pugState.maps = require('./maps.json');
	chooseMap(message);
}

const checkAvoided = (player) => {
	return player.matches_without_playing >= 1;
};

const deleteFromRolesList = (player, roleList) => { // Removes the player from all lists, this is necessary so he won't get picked again in the same team or enemy team.
	Object.keys(roleList).forEach((key) => {
		roleList[key] = roleList[key].filter(name => name !== player);
	});
}
