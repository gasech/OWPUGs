const embed = require('../embeds');
const fs = require('fs');

module.exports = {
	name: 'stats',
	description: 'Replies with your stats or anyone that you target',
	execute(message, args) {
		const players = getJsonPlayers(); // json
		const serverID = message.guild.id;

		if (args == "") {
			const playerID = message.author.id;
			sendStats(message, playerID, players, serverID);
		} else {
			if (args.length !== 1) return embed.sendReply(message, `Please use **pugs!stats @user**`);
			const taggedUser = args[0];
			const playerID = taggedUser.replaceAll(/[<@!>]/ig, '');
			sendStats(message, playerID, players, serverID);
		}
	},
};

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

const sendStats = (message, playerID, players, serverID) => {
	const indexUser = players.findIndex(player => player.user_id === playerID && player.server_id === serverID);
	const notFound = -1; // If not found returns -1

	if (indexUser != notFound) {
		embed.sendReply(message,
			`**${players[indexUser].name}'s stats:**\n
			**Roles:** ${players[indexUser].roles}
			**Wins:**	${players[indexUser].wins}
			**Losses:**	${players[indexUser].losses}`
		);
	} else {
		embed.sendReply(message, `Could not find user stats, please play atleast one match to have your stats registered.`);
	}
}
