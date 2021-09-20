const fs = require('fs');

const editJSON = {
  readPlayers: (message, text) => {
    let players;
    try {
      const data = JSON.parse(fs.readFileSync('./players.json', 'utf8'));
      players = data;
    } catch (err) {
      console.error(err)
    }
    return players;
  },
  writePlayers: (players) => { // Writes over players.json file
    try {
      fs.writeFileSync('./players.json', JSON.stringify(players, null, 2))
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = editJSON