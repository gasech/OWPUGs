const embed = require('../embeds');
const config = require('../config.json');
const maps = require('../maps.json');

module.exports = {
	name: 'pickup',
	description: 'Pickup players from voice channel and sends message with teams',
	execute(message, args) {
		if (!message.member.voice.channel) return message.reply(`You cannot start picking up players since you are not in a voice channel.`);
		const voiceInfo = message.member.voice.channel.members.array();
		chooseMap(message);
		if(voiceInfo.length <= 12) return message.reply(`You need atleast 12 players to start the PUG.`)
		voiceInfo.map((voiceUser) =>{
			console.log(voiceUser.user.username);
		})	
	},
};

const chooseMap = (message) => {
	embed.sendMap(message, maps[Math.floor(Math.random() * maps.length)]);
};