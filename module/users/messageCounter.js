let fs = require('fs');
let folder = './module/users/usersInfo/';


async function messageCounter (userFile, msg = null) {
	let messages = require(`./usersInfo/${userFile.messages}`);
	messages.messages++;

	let objTemplate = JSON.stringify(messages, null, 2);
	fs.writeFileSync(folder+userFile.messages, objTemplate, (err) => { if(err) throw err; });
}


module.exports = messageCounter;
