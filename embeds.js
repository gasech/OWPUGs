const { Client, MessageEmbed } = require('discord.js');

const embed = new MessageEmbed().setColor(0xffa500);

const embeds = {
  sendMessage: (message, text) => {
      embed.setDescription(text);
      message.channel.send(embed);
  },
  sendReply: (message, text) => {
    embed.setDescription(text);
    message.reply(embed);
  },
  sendMap: (message, map) => {
    embed.setDescription(`**Map:** ${map.name} ${map.flag}\n**Mode:** ${map.mode}`);
    embed.setThumbnail(`${map.imageSource}`);
    
    message.channel.send(embed);
  }
}

module.exports = embeds