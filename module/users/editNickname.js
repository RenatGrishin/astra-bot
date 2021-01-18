let fs = require('fs');
let checkFileUserInfo = require('./checkFileUserInfo');
let path = './module/users/usersInfo/'

function editNickname (user, nick, name){
	let error = [];
	let info = {
		error: true,
		message: ``,
		newNick: ``
	}

	if(!nick) error.push('НИК');
	if(!name) error.push('ИМЯ');

	if(error.length){
		info.error = true
		if(error.length === 1){
			info.message = `<@${user.id}> \nЗабыл вписать ник или имя. \n` +
				`**!name** НИК ИМЯ \n`;
		}
		if (error.length === 2){
			info.message = `<@${user.id}> \n**!name** НИК ИМЯ`;
		}
	}else{
		let pathUser = path + user.id+'.json';
		let userInfo = checkFileUserInfo(user)

		userInfo.nick = nick;
		userInfo.name = name;

		let objTemplate = JSON.stringify(userInfo, null, 2);
		console.log(objTemplate)
		fs.writeFile(pathUser, objTemplate, (err) => { if(err) throw err; });

		info.error = false;
		info.message = `Теперь я буду звать тебя – <@${user.id}>`;
		info.newNick = `${nick} (${name})`;
	}
	return info;
}

module.exports = editNickname;