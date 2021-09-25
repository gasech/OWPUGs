const embed = require('../utils/embeds');

module.exports = {
  name: 'decline',
  description: 'Declines the match',
  execute(message, args, pugState) {
    if (!pugState.acceptMatchPeriod) return embed.sendReply(message, "You must be in accept match period, please type **pugs!pickup**");

    pugState.acceptMatchPeriod = false;
    pugState.teams = [["", "", "", "", "", ""], ["", "", "", "", "", ""]];
    
    let players = editJSON.readPlayers();
    players = makeAllInactive(players);
    editJSON.writePlayers(players);

    embed.sendMessage(message, "Match declined with success!");
  },
};

const makeAllInactive = (players) => { 
	players.map((player) => {
		player.active = false;
		return player;
	});
	return players;
}