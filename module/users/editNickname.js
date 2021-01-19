let fs = require('fs');
let checkFileUserInfo = require('./checkFileUserInfo');
let folder = './module/users/usersInfo/'

/*
	arrMess[0] – Ник
	arrMess[1] – Имя
	arrMess[2] – Фамилия
*/
async function editNickname (user, arrMess, msg){
	let error = [];
	let info = {
		error: true,
		message: ``,
		newNick: ``
	}

	if(!arrMess[0]) error.push('НИК');
	if(!arrMess[1]) error.push('ИМЯ');

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
		let path = await checkFileUserInfo(user);
		let userInfo = require(`./usersInfo/${path.messages}`);

		userInfo.nick = arrMess[0];
		userInfo.name = arrMess[1];
		if(arrMess[2]) userInfo.name = userInfo.name +' '+ arrMess[2];

		let objTemplate = JSON.stringify(userInfo, null, 2);
		console.log(objTemplate)
		fs.writeFile(folder+path.info, objTemplate, (err) => { if(err) throw err; });

		info.error = false;
		info.message = `Теперь я буду звать тебя – <@${user.id}>`;
		info.newNick = `${userInfo.nick} (${userInfo.name})`;
	}

	if(info.error){
		msg.channel.send(info.message)
	}else{
		msg.member.setNickname(info.newNick);
		msg.channel.send(info.message)
	}
}

module.exports = editNickname;