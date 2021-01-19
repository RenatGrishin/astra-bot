const Discord = require('discord.js');
const bot = new Discord.Client();
let config = require('./botconfig.json');
let prefix = config.prefix;

let messageCounter = require('./module/users/messageCounter');
let editNickname = require('./module/users/editNickname');

bot.on("message", msg=>{
	if (!msg.author.bot){
		let command = msg.content.split(' ', 1)[0].toLowerCase();

		if (command === prefix + 'mes') {
			//msg.channel.send(msg.guild.id);
			messageCounter(msg.author, msg)
		}

		/*  Изменить себе ник  */
		if (command === prefix + 'name') {
			let say = msg.content.split(' ', 4);
			say.shift();

			editNickname(msg.author, say, msg);
		}
		if (command === prefix + 'w') {
			console.log("смена имени");
			console.log(msg.member)
			//msg.member.setNickname(msg.content.replace('changeNick ', 'р'));
			//msg.guild.members.get(msg.author.id).setNickname("Шашлык")
			//console.log(msg.author.id);
			//console.log(msg.member.guild.members);
			//msg.author.id.setNickname("Шашлык")
		}
	}
})

bot.login(config.token);

bot.on('ready', () => {
	console.log(`${bot.user.username} online`);
});