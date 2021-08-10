const embed = require('../embeds');
const fs = require('fs');

module.exports = {
	name: 'stats',
	description: 'Replies with your stats or anyone that you target',
	execute(message, args) {
		const players = getJsonPlayers(); // json

		if (args == "") {
			const playerID = message.author.id;
			sendStats(message, playerID, players);
		} else {
			console.log(args.length);
			if (args.length !== 1) return embed.sendReply(message, `Please use **pugs!stats @user**`);
			const taggedUser = args[0];
			const playerID = taggedUser.replaceAll(/[<@!>]/ig, '');
			sendStats(message, playerID, players);
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

const sendStats = (message, playerID, players) => {
	try {
		let index = players.findIndex(player => player.user_id === playerID);

		embed.sendReply(message,
			`**${players[index].name}'s stats:**\n
			**Roles:** ${players[index].roles}
			**Wins:**	${players[index].wins}
			**Losses:**	${players[index].losses}`
		);
	} catch (err) {
		embed.sendReply(message, `Could not find user stats, please play atleast one match to have your stats registered.`);
	}
}
