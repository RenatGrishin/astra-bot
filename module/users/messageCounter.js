let fs = require('fs');
let checkFileUserInfo = require('./checkFileUserInfo');
let folder = './module/users/usersInfo/';


async function messageCounter (user, msg = null) {
	let path = await checkFileUserInfo(user);
	let messages = require(`./usersInfo/${path.messages}`);

	messages.messages++;

	let objTemplate = JSON.stringify(messages, null, 2);
	fs.writeFile(folder+path.messages, objTemplate, (err) => { if(err) throw err; });
}


module.exports = messageCounter;
