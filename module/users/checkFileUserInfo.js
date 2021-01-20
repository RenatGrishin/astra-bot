let fs = require('fs');
const info = require('./usersInfo/template/template');
const messages = require('./usersInfo/template/template_messages');
const warnings = []; //require('./usersInfo/template/template_warnings');
let folder = './module/users/usersInfo/';

async function checkFileUserInfo(user){
	const userInfoJSON = folder + user.id+'.json';
	const userMessagesJSON = folder + user.id+'_messages.json';
	const userWarningsJSON = folder + user.id+'_warnings.json';

	let newInfo = null;
	let newMessage = null;
	let newWarning = null;

	/* Если нет файла с информацие, то заполняем и создаем новый файл */
	if(!fs.existsSync(userInfoJSON)){
		newInfo = info;
		newInfo.mainID = user.id;
		newInfo.mainNick = user.username;
		newInfo.discriminator = user.discriminator;
		newInfo.avatar = user.avatar;

		let objTemplate = JSON.stringify(newInfo, null, 2);
		fs.writeFile(userInfoJSON, objTemplate, (err) => { if(err) throw err; });
	}

	/* Если нет файла с сообщениями, то заполняем и создаем новый файл */
	if(!fs.existsSync(userMessagesJSON)){
		newMessage = messages;
		newMessage.messages = 0;

		let objTemplate = JSON.stringify(newMessage, null, 2);
		fs.writeFile(userMessagesJSON, objTemplate, (err) => { if(err) throw err; });
	}

	/* Если нет файла с предупреждениями, то заполняем и создаем новый файл */
	if(!fs.existsSync(userWarningsJSON)){
		let objTemplate = JSON.stringify(warnings, null, 2);
		fs.writeFile(userWarningsJSON, objTemplate, (err) => { if(err) throw err; });
	}

	return {
		info: `${user.id}.json`,
		messages: `${user.id}_messages.json`,
		warnings: `${user.id}_warnings.json`
	};
}

module.exports = checkFileUserInfo;