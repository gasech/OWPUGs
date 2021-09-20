const embed = require('../utils/embeds');

module.exports = {
  name: 'createroles',
  description: 'Creates all roles needed to start using the bot',
  execute(message) {
    console.log(`Creating roles for server: ${message.guild.name}`);

    const roles = [
      {
        name: "Main Tank",
        color: 'BLUE'
      },
      {
        name: "Off Tank",
        color: 'PURPLE'
      },
      {
        name: "DPS Hitscan",
        color: [167, 11, 92]
      },
      {
        name: "DPS Flex",
        color: 'LUMINOUS_VIVID_PINK'
      },
      {
        name: "Main Support",
        color: 'GOLD'
      },
      {
        name: "Flex Support",
        color: 'GREEN'
      },
    ];

    roles.forEach((role) => {
      message.guild.roles.create({
        data: {
          name: role.name,
          color: role.color
        }
      })
        .then(console.log(`${role.name} role created with success.`))
        .catch(console.error);
    });
    embed.sendReply(message, 'Created all roles with success.');
  },
};