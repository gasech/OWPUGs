const config = require('../config.json');
const embed = require('../utils/embeds');
const editJSON = require('../utils/jsonEditor');

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
			const notFound = -1; 

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
						roleList[role].push(player);
					}
				} else {
					roleList[role].push(player);
				}
			});
		});

		let counter = -1;
		Object.keys(roleList).forEach((key) => {
			for (let i = 0; i < 2; i++) {
				if (roleList[key].length != 0) {
					const pickedPlayer = roleList[key][Math.floor(Math.random() * roleList[key].length)];
					pugState.teams[i][Math.round(counter / 2)] = pickedPlayer;
					counter++;
					deleteFromRolesList(pickedPlayer, roleList);
				} else { 
					embed.sendReply(message, `Not enough players in the following role: ${key}.`);
					break;
				}
			}
		});

		if(counter != 11) return embed.sendMessage(message, `Not enough players in roles.`);

		chooseMap(message, pugState);

		pugState.acceptMatchPeriod = true;

		message.channel.send({ embed: { color: 0x3298c7, description: `**Team 1**: \nMain Tank: ${pugState.teams[0][0].name}\nOff Tank: ${pugState.teams[0][1].name}\nDPS Hitscan: ${pugState.teams[0][2].name}\nDPS Flex: ${pugState.teams[0][3].name}\nFlex Support: ${pugState.teams[0][4].name}\nMain Support: ${pugState.teams[0][5].name}` } }).then(msgSent => {
			pugState.messageTeamOneId = msgSent.id;
		});

		message.channel.send({ embed: { color: 0xfc1722, description: `**Team 2**: \nMain Tank: ${pugState.teams[1][0].name}\nOff Tank: ${pugState.teams[1][1].name}\nDPS Hitscan: ${pugState.teams[1][2].name}\nDPS Flex: ${pugState.teams[1][3].name}\nFlex Support: ${pugState.teams[1][4].name}\nMain Support: ${pugState.teams[1][5].name}` } }).then(msgSent => {
			pugState.messageTeamTwoId = msgSent.id;
		});

		embed.sendMessage(message, `Teams are ready, please type **pugs!accept** or **pugs!decline** to either accept or decline the match.`);

		editJSON.writePlayers(players);
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

const chooseMap = (message, pugState) => {
	if (pugState.maps.length == 0) {
		resetMaps(message, pugState);
	} else {
		const pickedNumber = Math.floor(Math.random() * pugState.maps.length)
		embed.sendMap(message, pugState.maps[pickedNumber]);
		pugState.pickedMap = pugState.maps[pickedNumber].name;
	}
}

const resetMaps = (message, pugState) => {
	pugState.maps = require('./maps.json');
	chooseMap(message);
}

const checkAvoided = (player) => {
	return player.matches_without_playing >= 1;
}

const deleteFromRolesList = (player, roleList) => {
	Object.keys(roleList).forEach((key) => {
		roleList[key] = roleList[key].filter(name => JSON.stringify(name) !== JSON.stringify(player));
	});
}