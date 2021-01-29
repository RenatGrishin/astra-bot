let fs = require('fs');
let checkFileUserInfo = require('./checkFileUserInfo');
let folder = './module/users/usersInfo/'

async function banDelete(user){
	let userInfo = require(`./usersInfo/${user.info}`);

	if (userInfo.ban.count != 0){
		userInfo.ban.count = userInfo.ban.count - 1;
		userInfo.ban.status = false;
		userInfo.ban.description = '';
		userInfo.ban.end = '';

		let objTemplate = JSON.stringify(userInfo, null, 2);
		fs.writeFileSync(folder+user.info, objTemplate, (err) => { if(err) throw err; });
	}

}

module.exports = banDelete;