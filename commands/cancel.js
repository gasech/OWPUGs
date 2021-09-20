const embed = require('../utils/embeds');
const editJSON = require('../utils/jsonEditor');

module.exports = {
  name: 'cancel',
  description: 'Cancels the match',
  execute(message, args, pugState) {
    if (!pugState.pugsRunning) return embed.sendReply(message, "There must be a match running.");
    pugState.pugsRunning = false;
  },
};