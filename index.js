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
let profileView = require('./module/users/profileView');                  // Получить профиль пользователя
let hiAndBye = require('./module/hiAndBye/hiAndBye');
let warningAdd = require('./module/users/warningAdd');
let commandGetParameters = require('./module/commandGetParameter');       // Получить из строки параметры для ф-ции
let banAdd = require('./module/users/banAdd');
let banAndWarningTimeoutCheck = require('./module/users/banAndWarningTimeoutCheck'); // Пр-ка истечение бана и пред-я
let roleValidation = require('./module/users/roleValidation');            // Проверка на соответсве роли к рангу
let guardUser = require('./module/users/guardUser');
let rankImage = require('./module/users/rankImage');
let banDelete = require('./module/users/banDelete');

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
			let mainRole = await roleValidation(msg.guild, user);   // сюда вставим проверку на роли.
			let info = await profileView(user, calcRank);           // показываем профиль пользователя
			await rankImage(info, msg, mainRole);
		}

		/* Получить карточку другого игрока */
		if (await checkCommand(command, prefix, cmd.getProfileFriend)) {
			let cmdParam = await commandGetParameters(msg.content, 1);
			cmdParam[0] = cmdParam[0].slice(3, -1);
			let member = msg.guild.members.cache.get(`${cmdParam[0]}`);
			let user = await checkFileUserInfo(member);
			await banAndWarningTimeoutCheck(user);                  // Проверяем срок бана и предупреждений
			let calcRank = await calculateRank(user);               // считаем ранг
			let mainRole = await roleValidation(msg.guild, user);   // сюда вставим проверку на роли.
			let info = await profileView(user, calcRank);           // показываем профиль пользователя
			await rankImage(info, msg, mainRole);
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
				console.log('Показать всех пользователей на в зале');
				msg.guild.members.cache.map(member => {console.log(`${member.user.id} - ${member.user.username}`)})
			}
			/* Получить все роли и их id */
			if (await checkCommand(command, prefix, cmd.adminGetRoleAndId)){
				console.log('Показать все роли в таверне');
				msg.guild.roles.cache.map(role => {console.log(`${role.id} - ${role.name}`)})
			}

			/* Дать предупреждение */
			if (await checkCommand(command, prefix, cmd.adminAddWarning)){
				let cmdParam = await commandGetParameters(msg.content, 4);
				let userWarning = await warningAdd(msg, cmdParam);
				let sayText = `<@!${cmdParam[0]}> Дорогая моя, ты получаешь предупреждение. Причина: \n${userWarning.warning.description}`;

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
				cmdParam[0] = cmdParam[0].slice(3, -1);

				/* Выдаем позорную роль в качестве бана */
				let member = msg.guild.members.cache.get(`${cmdParam[0]}`);
				let role = msg.guild.roles.cache.find(role=>role.id == "695297927727284284");
				console.log(cmdParam[0])
				member.roles.add(role)

				bot.channels.cache.get(mainChannel).send(`<@!${cmdParam[0]}> ${userBan}`);
			}

			/* убрать бан */
			if (await checkCommand(command, prefix, cmd.adminDeleteBan)){
				console.log('Delete ban')
				let cmdParam = await commandGetParameters(msg.content, 1);
				cmdParam[0] = cmdParam[0].slice(3, -1);

				let member = msg.guild.members.cache.get(`${cmdParam[0]}`);
				let user = await checkFileUserInfo(member.user);

				await banDelete(user)
				await roleValidation(msg.guild, user);
			}

			/* Тестовая  консоль */
			if (command === prefix){
				console.log("Тестовая команда");
				let te = msg.guild.members.cache.find(member => member.user.id == '224095657223258112')
				te.roles.cache.map(role =>{ console.log(role.id +" - "+ role.name ) })
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
	let avatarList = [];
	bot.guilds.cache.find(key=>key == mainChannel).members.cache.map((member) => {
		allUsers.push(member.user)
	});
	bot.guilds.cache.find(key=>key == mainChannel).members.cache.map((member) => {
		avatarList.push(member.user.displayAvatarURL({format: 'jpg'}))
	});
	console.log(allUsers)
	let forList = bot.guilds.cache.find(key=>key == mainChannel).members.cache.map(member=>member[1]);
	//for (let i=0; i < )

	for (let i=0; i < allUsers.length; i++){
		let user = await checkFileUserInfo(allUsers[i], false);
		await banAndWarningTimeoutCheck(user);                            // Проверяем срок бана и предупреждений
		await calculateRank(user);                                        // считаем ранг
		let msgBot = bot.guilds.cache.find(key=>key == mainChannel);
		await roleValidation(msgBot, user);                               // сюда вставим проверку на роли.
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