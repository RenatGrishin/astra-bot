const Discord = require('discord.js');
const bot = new Discord.Client();
let config = require('./botconfig.json');
let prefix = config.prefix;

let messageCounter = require('./module/users/messageCounter');
let editNickname = require('./module/users/editNickname');
let conditionForMessage = require('./module/users/conditionForMessage');
let calculateRank = require('./module/users/calculateRank');
let rankEdit = require('./module/users/rankEdit');
let profileView = require('./module/users/profileView');

bot.on("message", async msg=>{

	if (!msg.author.bot){
		let command = msg.content.split(' ', 1)[0].toLowerCase();

		/* Записываем сообщение в счетчик */
		if( await conditionForMessage(msg.content, ['!']) ){
			await messageCounter(msg.author, msg);
		}

		/*  Изменить себе ник  */
		if (command === prefix + 'name') {
			let say = msg.content.split(' ', 4);
			say.shift();

			await editNickname(msg.author, say, msg);
		}

		/*  Получить карточку о себе  */
		if (command === prefix + 'me') {
			let calcRank = await calculateRank(msg.author);
			let userCart = await rankEdit(msg.author, calcRank);
			await profileView(msg.author, userCart, calcRank);
		}

		if (command === prefix + 'say'){
			if(msg.channel.id == 706564776138113084){

				console.log(msg.content)
				msg.channel.send(msg.content);
			}
		}

		if (command === prefix + 'w') {
			console.log("смена имени");
			console.log(msg.member)
			// msg.guild.roles.cache.map(key => {console.log(key.name +' - '+ key.id)}) // получить id роли
			//msg.member.setNickname(msg.content.replace('changeNick ', 'р'));
			//msg.guild.members.get(msg.author.id).setNickname("Шашлык")
			//console.log(msg.author.id);
			//console.log(msg.member.guild.members);
			//msg.channel.send(msg.guild.id);
			//msg.author.id.setNickname("Шашлык")
		}
	}
})

bot.login(config.token);

bot.on('ready', () => {
	console.log(`${bot.user.username} online`);
});