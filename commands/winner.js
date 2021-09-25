const embed = require('../utils/embeds');
const editJSON = require('../utils/jsonEditor');

module.exports = {
	name: 'winner',
	description: 'Registers the winners of match',
	execute(message, args, pugState) {
		if (!pugState.pugsRunning) return embed.sendReply(message, "There must be a match running, so you can register wins");
		if (args.length != 1) return embed.sendReply(message, "Incorrect usage, please use **pugs!winner team1** or **pugs!winner team2**");
		args[0] = args[0].toLowerCase();
		if (!["team1", "team2"].includes(args[0])) return embed.sendReply(message, "Incorrect usage, please use **pugs!winner team1** or **pugs!winner team2**");
		const winner = args[0] === "team1" ? 0 : 1;
		const loser = args[0] === "team1" ? 1 : 0;

		let players = editJSON.readPlayers();

		pugState.teams[0].forEach((playerT) => {
			const playerIndex = players.findIndex(player => player.name === playerT);
			if (winner == 0) {
				players[playerIndex].wins++;
			} else {
				players[playerIndex].losses++;
			}
		});

		pugState.teams[1].forEach((playerT) => {
			const playerIndex = players.findIndex(player => player.name === playerT);
			if (winner == 1) {
				players[playerIndex].wins++;
			} else {
				players[playerIndex].losses++;
			}
		});

		embed.sendMessage(message, `Match ended, **team ${winner+1}** is the winner!\n\n All players from **team ${winner+1}** have been granted with a win.\nAll players from **team ${loser+1}** have been granted with a loss.`)

		editJSON.writePlayers(players);
		pugState.pugsRunning = false;
	},
};