let fs = require('fs');
let checkFileUserInfo = require('./checkFileUserInfo');
let folder = './module/users/usersInfo/'

async function guardUser(msg, user, setGuard) {
	user = user.slice(3, -1);
	user = msg.guild.members.cache.find(member => member == user).user;

	let path = await checkFileUserInfo(user);
	let userInfo = require(`./usersInfo/${path.info}`);

	let outcome = {
		error: null,
		compl: null
	}

	if(setGuard == 'true'){
		outcome.compl = true;
	}else if (setGuard == 'false'){
		outcome.compl = false;
	}else{
		outcome.error = 'Введен неверный параметр после имени. Допустимые параметры **true** или **false** \n !guard user true | false';
	}

	if (!outcome.error){
		userInfo.fix = setGuard;

		let objTemplate = JSON.stringify(userInfo, null, 2);
		fs.writeFileSync(folder+path.info, objTemplate, (err) => { if(err) throw err; });
	}

	// Вывод сообщения в чат
	if(outcome.error){
		msg.channel.send(outcome.error)
	}else{
		outcome.compl ? msg.channel.send("Пользователь под защитой.") : msg.channel.send("Пользователь в моей власти");
	}
}

module.exports = guardUser;