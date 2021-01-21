let fs = require('fs');
let checkFileUserInfo = require('./checkFileUserInfo');
let folder = './module/users/usersInfo/'

async function rankEdit(user, rankPoint) {
	let path = await checkFileUserInfo(user);
	let userInfo = require(`./usersInfo/${path.info}`);

	userInfo.rank = rankPoint.rank;

	let objTemplate = JSON.stringify(userInfo, null, 2);
	fs.writeFileSync(folder+path.info, objTemplate, (err) => { if(err) throw err; });

	return userInfo;
}

module.exports = rankEdit;