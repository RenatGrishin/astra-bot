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
			msg.channel.send(msg.guild.id);
			messageCounter(msg.author)
		}

		/*  Изменить себе ник  */
		if (command === prefix + 'name') {
			let say = msg.content.split(' ', 4);
			let userName = say[2]
			if(say[3]){ userName += ' '+ say[3]}

			let myNick = editNickname(msg.author, say[1], userName);
			if(myNick.error){
				msg.channel.send(myNick.message);
			}else{
				msg.member.setNickname(myNick.newNick);
				msg.channel.send(myNick.message)
				//msg.guild.member(792364133386813440).setNickname("myNick.newNick");
			}
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