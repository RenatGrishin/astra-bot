const Discord = require('discord.js');
const bot = new Discord.Client();
let config = require('./botconfig.json');
let prefix = config.prefix;

let createFileUserInfo = require('./module/users/createFileUserInfo');

bot.on("message", msg=>{
	if (msg.content === prefix + '') {
		msg.channel.send(msg.guild.id);
		createFileUserInfo()
	}
})

bot.login(config.token);

bot.on('ready', () => {
	console.log(`${bot.user.username} online`);
});