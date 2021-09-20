const embed = require('../utils/embeds');
const editJSON = require('../utils/jsonEditor');

module.exports = {
	name: 'accept',
	description: 'Accepts the match',
	execute(message, args, pugState) {
		if (!pugState.acceptMatchPeriod) return embed.sendReply(message, "You must be in accept match period, please type **pugs!pickup**.");

		embed.sendMessage(message, `Match accepted, please create the lobby with the selected players in both teams, after finishing the map please type **pugs!winner team1** or **pugs!winner team2**`);
		
		let players = editJSON.readPlayers();

		for (let i = 0; i < players.length; i++) {
			if (!findPlayerInTeams(players[i], pugState)) {
				pugState.players[i].matchesWithoutPlaying++;
			} else {
				pugState.players[i].matchesWithoutPlaying = 0;
			}
		}

		editJSON.writePlayers(players);

		deleteMapFromList(pugState);
		pugState.acceptMatchPeriod = false;
		pugState.pugsRunning = true;
	}
};

const findPlayerInTeams = (playerI, pugState) => {
	let found = false;

	for (let player of pugState.teams[0]) {
		if (playerI.name == player) {
			found = true;
		}
	}

	for (let player of pugState.teams[1]) {
		if (playerI.name == player) {
			found = true;
		}
	}

	return found;
}

const deleteMapFromList = (pugState) => {
	for (let i = pugState.maps.length; i--;) {
		if (pugState.maps[i].name == pugState.pickedMap) pugState.maps.splice(i, 1);
	}
}