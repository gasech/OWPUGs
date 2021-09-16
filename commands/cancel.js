const embed = require('../embeds');
const editJSON = require('../jsonEditor');

module.exports = {
  name: 'cancel',
  description: 'Cancels the match',
  execute(message, args, pugState) {
    if (!pugState.pugsRunning) return embed.sendReply(message, "There must be a match running.");
    pugState.pugsRunning = false;
  },
};