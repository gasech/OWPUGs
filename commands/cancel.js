const embed = require('../utils/embeds');
const editJSON = require('../utils/jsonEditor');

module.exports = {
  name: 'cancel',
  description: 'Cancels the match',
  execute(message, args, pugState) {
    if (!pugState.pugsRunning) return embed.sendReply(message, "There must be a match running.");
    embed.sendMessage(message, "Match canceled with success!");
    pugState.pugsRunning = false;
    pugState.teams = [["", "", "", "", "", ""], ["", "", "", "", "", ""]];

    let players = editJSON.readPlayers();
    players = reduceMatchesWithoutPlaying(players);
    editJSON.writePlayers(players);
  },
};

const reduceMatchesWithoutPlaying = (players) => { 
	players.map((player) => {
		if(player.matches_without_playing > 0){
      player.matches_without_playing--;
    }
		return player;
	});
	return players;
}