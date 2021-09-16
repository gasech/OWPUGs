const embed = require('../embeds');

module.exports = {
  name: 'decline',
  description: 'Declines the match',
  execute(message, args, pugState) {
    if (!pugState.acceptMatchPeriod) return embed.sendReply(message, "You must be in accept match period, please type **pugs!pickup**");
    embed.sendMessage(message, "Match declined with success");
    pugState.acceptMatchPeriod = false;
  },
};