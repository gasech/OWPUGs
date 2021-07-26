module.exports = {
	name: 'saymyname',
	description: 'Command replys with the username and nickname (if not available with undefined) in chat.',
	execute(message, args) {
		let nickname = message.member.nickname;
		let username = message.author.username; 
		message.reply(`${nickname} ${username}`);
	},
};