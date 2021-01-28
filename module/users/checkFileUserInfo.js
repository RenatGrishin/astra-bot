let fs = require('fs');
const info = require('./usersInfo/template/template');
const messages = require('./usersInfo/template/template_messages');
let folder = './module/users/usersInfo/';

async function checkFileUserInfo(user){

	const userInfoJSON = folder + user.id+'.json';
	const userMessagesJSON = folder + user.id+'_messages.json';

	let newInfo = null;
	let newMessage = null;

	/* Если нет файла с информацие, то заполняем и создаем новый файл */
	if(!fs.existsSync(userInfoJSON)){
		newInfo = info;
		newInfo.mainID = user.id;
		newInfo.mainNick = user.username;
		newInfo.discriminator = user.discriminator;
		newInfo.avatar = user.displayAvatarURL({format: 'jpg'});

		let objTemplate = JSON.stringify(newInfo, null, 2);
		await fs.writeFileSync(userInfoJSON, objTemplate, (err) => { if(err) throw err; });
	}

	/* Если нет файла с сообщениями, то заполняем и создаем новый файл */
	if(!fs.existsSync(userMessagesJSON)){
		newMessage = messages;
		newMessage.messages = 0;

		let objTemplate = JSON.stringify(newMessage, null, 2);
		await fs.writeFileSync(userMessagesJSON, objTemplate, (err) => { if(err) throw err; });
	}

	return {
		info: `${user.id}.json`,
		messages: `${user.id}_messages.json`
	};
}

module.exports = checkFileUserInfo;