const Discord = require('discord.js');
const bot = new Discord.Client();
let config = require('./botconfig.json');
let prefix = config.prefix;
let cmd = require('./botComands');
const mainChannel = '330779118427832320'; // ID Общий зал

let checkCommand = require('./module/checkCommand');
let messageCounter = require('./module/users/messageCounter');
let editNickname = require('./module/users/editNickname');
let conditionForMessage = require('./module/users/conditionForMessage');
let calculateRank = require('./module/users/calculateRank');
let rankEdit = require('./module/users/rankEdit');
let profileView = require('./module/users/profileView');
let hiAndBye = require('./module/hiAndBye/hiAndBye');
let warningAdd = require('./module/users/warningAdd');
let commandGetParameters = require('./module/commandGetParameter');
let banAdd = require('./module/users/banAdd');
let banAndWarningTimeoutCheck = require('./module/users/banAndWarningTimeoutCheck');

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
		if (await checkCommand(command, prefix, cmd.profileCart)) {
			await banAndWarningTimeoutCheck(msg.author);
			let calcRank = await calculateRank(msg.author);
			let userCart = await rankEdit(msg.author, calcRank);
			await profileView(msg.author, userCart, calcRank);
		}

		/* Сказать от имени бота */
		if (await checkCommand(command, prefix, cmd.adminSay) && msg.channel.id == 706564776138113084){
			let sum = await checkCommand(command, prefix, cmd.adminSay)
			bot.channels.cache.get(mainChannel).send(msg.content.slice(sum));
		}

		/* Дать предупреждение */
		if (await checkCommand(command, prefix, cmd.adminAddWarning) && msg.channel.id == 706564776138113084){
			let cmdParam = await commandGetParameters(msg.content, 4);
			let userWarning = await warningAdd(msg, cmdParam);
			let sayText = `<@!${cmdParam[0]}> Дорогая моя, ты получаешь предупрежение. Причина: \n${userWarning.warning.description}`;

			if(userWarning.ban){
				let userBan = await banAdd(msg, userWarning.ban.userID, userWarning.ban.description, null, userWarning.user);
				sayText += `\nА еще ${userWarning.ban.description}. \n${userBan}`;

				/* Выдаем позорную роль в качестве бана */
				let member = msg.guild.members.cache.get(`${cmdParam[0]}`);
				let role = msg.guild.roles.cache.find(role=>role.id == "695297927727284284");
				member.roles.add(role)
			}

			bot.channels.cache.get(mainChannel).send(sayText);
		}
		/* Дать бан */
		if (await checkCommand(command, prefix, cmd.adminAddBan) && msg.channel.id == 706564776138113084){
			let cmdParam = await commandGetParameters(msg.content, 3);
			let userBan = await banAdd(msg, cmdParam[0], cmdParam[2], cmdParam[1]);

			/* Выдаем позорную роль в качестве бана */
			let member = msg.guild.members.cache.get(`${cmdParam[0]}`);
			let role = msg.guild.roles.cache.find(role=>role.id == "695297927727284284");
			member.roles.add(role)

			bot.channels.cache.get(mainChannel).send(`<@!${cmdParam[0]}> ${userBan}`);
		}

		/* Тестовая  консоль */
		if (command === prefix && msg.channel.id == 706564776138113084){
			await banAndWarningTimeoutCheck(msg.author);
		}

		if (command === prefix + 'w') {
			console.log("смена имени");
			console.log(msg.member)
			// bot.channels.cache.get('330779118427832320').send(msg.content.slice(4)); // отправить сообщение в нужный канал
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


bot.on("guildMemberAdd", async member => {
	bot.channels.cache.get(mainChannel).send(await hiAndBye("hi", member.id));
});
bot.on("guildMemberRemove", async member => {
	bot.channels.cache.get(mainChannel).send(await hiAndBye("bye", member.id));
});

bot.login(config.token);

bot.on('ready', () => {
	console.log(`${bot.user.username} online`);
});