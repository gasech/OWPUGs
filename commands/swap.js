const embed = require('../utils/embeds');

module.exports = {
  name: 'swap',
  description: 'Swap players from opposite teams',
  execute(message, args, pugState) {
    if (!pugState.acceptMatchPeriod && !pugState.pugsRunning) return embed.sendReply(message, "You must be in a match or accept match period to edit teams.")
    if (args.length !== 2) return embed.sendReply(message, `Incorrect usage, please use **pugs!swap player1 player2**`);
    
    const player1 = findPlayerInTeams(args[0], pugState);
    const player2 = findPlayerInTeams(args[1], pugState);

    if (player1 == 0) return embed.sendReply(message, `${args[0]} not found in neither team.`);
    if (player2 == 0) return embed.sendReply(message, `${args[1]} not found in neither team.`);

    if (player1 == 1) {
      const indexPlayer1 = pugState.teams[0].findIndex(player => player == args[0]);
      const indexPlayer2 = pugState.teams[1].findIndex(player => player == args[1]);
      [pugState.teams[0][indexPlayer1], pugState.teams[1][indexPlayer2]] = [pugState.teams[1][indexPlayer2], pugState.teams[0][indexPlayer1]];
    } else {
      const indexPlayer1 = pugState.teams[1].findIndex(player => player == args[0]);
      const indexPlayer2 = pugState.teams[0].findIndex(player => player == args[1]);
      [pugState.teams[1][indexPlayer1], pugState.teams[0][indexPlayer2]] = [pugState.teams[0][indexPlayer2], pugState.teams[1][indexPlayer1]];
    }

    message.channel.messages.fetch(pugState.messageTeamOneId)
      .then(message => message.edit(({ embed: { color: 0x3298c7, description: `**Team 1**: \nMain Tank: ${pugState.teams[0][0].name}\nOff Tank: ${pugState.teams[0][1].name}\nDPS Hitscan: ${pugState.teams[0][2].name}\nDPS Flex: ${pugState.teams[0][3].name}\nFlex Support: ${pugState.teams[0][4].name}\nMain Support: ${pugState.teams[0][5].name}` } })))
      .catch(console.error);

    message.channel.messages.fetch(pugState.messageTeamTwoId)
      .then(message => message.edit(({ embed: { color: 0xfc1722, description: `**Team 2**: \nMain Tank: ${pugState.teams[1][0].name}\nOff Tank: ${pugState.teams[1][1].name}\nDPS Hitscan: ${pugState.teams[1][2].name}\nDPS Flex: ${pugState.teams[1][3].name}\nFlex Support: ${pugState.teams[1][4].name}\nMain Support: ${pugState.teams[1][5].name}` } })))
      .catch(console.error);
    embed.sendMessage(message, `Successfully swapped from ${args[0]} to ${args[1]}.`);

  },
};

const findPlayerInTeams = (player, pugState) => {
  let team = 0;

  pugState.teams[0].forEach((playerT) => {
    if (playerT.name == player) {
      team = 1;
    }
  });

  pugState.teams[1].forEach((playerT) => {
    if (playerT.name == player) {
      team = 2;
    }
  });

  return team;
}
