const Discord = require('discord.js');
const bot = new Discord.Client();
let config = require('./botconfig.json');
let prefix = config.prefix;
let cmd = require('./botComands');
const mainChannel = '330779118427832320'; // ID Общий зал

let checkFileUserInfo = require('./module/users/checkFileUserInfo');      // Проверка на наличия userInfo файлов
let checkCommand = require('./module/checkCommand');                      // Получить длинну команды + пробел
let messageCounter = require('./module/users/messageCounter');
let editNickname = require('./module/users/editNickname');                // Изменить себе ник
let conditionForMessage = require('./module/users/conditionForMessage');
let calculateRank = require('./module/users/calculateRank');              // Считаем ранг
let rankEdit = require('./module/users/rankEdit');
let profileView = require('./module/users/profileView');                  // Получить профиль пользователя
let hiAndBye = require('./module/hiAndBye/hiAndBye');
let warningAdd = require('./module/users/warningAdd');
let commandGetParameters = require('./module/commandGetParameter');       // Получить из строки параметры для ф-ции
let banAdd = require('./module/users/banAdd');
let banAndWarningTimeoutCheck = require('./module/users/banAndWarningTimeoutCheck'); // Пр-ка истечение бана и пред-я
let roleValidation = require('./module/users/roleValidation');            // Проверка на соответсве роли к рангу
let guardUser = require('./module/users/guardUser');
let rankImage = require('./module/users/rankImage');

bot.on("message", async msg=>{

	if (!msg.author.bot){
		let command = msg.content.split(' ', 1)[0].toLowerCase();

		/* Записываем сообщение в счетчик сообщений */
		if( await conditionForMessage(msg.content, ['!']) ){
			let user = await checkFileUserInfo(msg.author);
			await messageCounter(user, msg);
		}

		/*  Изменить себе ник  */
		if (await checkCommand(command, prefix, cmd.editNick)) {
			let say = msg.content.split(' ', 4);
			say.shift();

			let user = await checkFileUserInfo(msg.author);
			await editNickname(user, say, msg);
		}

		/*  Получить карточку о себе  */
		if (await checkCommand(command, prefix, cmd.profileCart)) {
			let user = await checkFileUserInfo(msg.author);
			await banAndWarningTimeoutCheck(user);                  // Проверяем срок бана и предупреждений
			let calcRank = await calculateRank(user);               // считаем ранг
			await roleValidation(msg.guild, user);                  // сюда вставим проверку на роли.
			await profileView(user, calcRank);                      // показываем профиль пользователя
		}

		/*  Команды Администартора  */
		if (msg.channel.id == 706564776138113084){

			/* Сказать от имени бота */
			if (await checkCommand(command, prefix, cmd.adminSay)){
				let sum = await checkCommand(command, prefix, cmd.adminSay)
				bot.channels.cache.get(mainChannel).send(msg.content.slice(sum));
			}

			/* Защитить пользователя от бота */
			if (await checkCommand(command, prefix, cmd.adminGuardProfile)){
				console.log('Защита пользователя от бота');
				let cmdParam = await commandGetParameters(msg.content, 2);
				await guardUser(msg, cmdParam[0], cmdParam[1]);
			}

			/* Получить всех пользователей и их id */
			if (await checkCommand(command, prefix, cmd.adminGetUserAndId)){
				console.log('Показать всех пользователей в чате');
				msg.guild.members.cache.map(member => {console.log(`${member.user.id} - ${member.user.username}`)})
			}

			/* Дать предупреждение */
			if (await checkCommand(command, prefix, cmd.adminAddWarning)){
				let cmdParam = await commandGetParameters(msg.content, 4);
				let userWarning = await warningAdd(msg, cmdParam, user);
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
			if (await checkCommand(command, prefix, cmd.adminAddBan)){
				let cmdParam = await commandGetParameters(msg.content, 3);
				let userBan = await banAdd(msg, cmdParam[0], cmdParam[2], cmdParam[1]);

				/* Выдаем позорную роль в качестве бана */
				let member = msg.guild.members.cache.get(`${cmdParam[0]}`);
				let role = msg.guild.roles.cache.find(role=>role.id == "695297927727284284");
				member.roles.add(role)

				bot.channels.cache.get(mainChannel).send(`<@!${cmdParam[0]}> ${userBan}`);
			}

			/* Тестовая  консоль */
			if (command === prefix){
				console.log("Тестовая команда");
				let te = msg.guild.members.cache.find(member => member.user.id == '224095657223258112')
					//member == 148422300243460096 {console.log(`${member.user.displayAvatarURL}`)})
				let img = te.user.displayAvatarURL({format: 'jpg'});
				await rankImage(msg, img);
			}
		}


		if (command === prefix + 'w') {
			console.log("смена имени");
			console.log(msg.member);
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


/* Проверка на ранги всех пользователей */
async function checkAllUsersRank(){
	let allUsers = [];
	bot.guilds.cache.find(key=>key == mainChannel).members.cache.map(member => allUsers.push(member));
	for (let i=0; i < allUsers.length; i++){
		console.log(allUsers[i].user.id)
		await banAndWarningTimeoutCheck(allUsers[i].user);                    // Проверяем срок бана и предупреждений
		let calcRank = await calculateRank(allUsers[i].user);                 // считаем ранг
		await rankEdit(allUsers[i].user, calcRank);                           // записываем ранг в файл с инфой
		/*
		Функция проверк на роли переработана, нужно ее исправить
		msgBot = msg.guilds.cache.find(key=>key == mainChannel)
		await roleValidation(bot, allUsers[i].user, true, mainChannel); // сюда вставим проверку на роли.
		*/
	}
}

/* Событие по времени */
async function callTimeEvent(){
	let dt = new Date();
	if(dt.getHours() == 1){
		await checkAllUsersRank();
	}
}

bot.on('ready', async (msg) => {
	console.log(`${bot.user.username} online`);
	setInterval(()=>{callTimeEvent()}, 1000*60*60); // Запускать функцию с интервалом в час

	// bot.user.setPresence ({status: 'dmd', game:{name: 'Gay Porn', type: 3}});
	// bot.user.setPresence ({status: 'dmd', game:{name: 'Голубая луна (Борис Моисеев)', type: 2}});
	// bot.user.setPresence ({game:{name: 'Counter-Strike: Gay Operation', status: "online"}});
});