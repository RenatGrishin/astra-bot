let fs = require('fs');
let folder = './module/users/usersInfo/';

function timeoutCheck (myDate){
	let today = new Date();
	let checkDate = new Date();
	checkDate.setTime(Date.parse(myDate));
	if (today>checkDate){
		return true;
	}
	return false;
}

async function banAndWarningTimeoutCheck(user) {
	let userInfo = require(`./usersInfo/${user.info}`);

	let newWarning = [];
	let edited = {
		warning: false,
		ban: false
	}

	if (userInfo.ban.status){
		if (timeoutCheck(userInfo.ban.end)){
			userInfo.ban.status = false;
			userInfo.ban.description = '';
			userInfo.ban.end = '';
			edited.ban = true
		}
	}
	if (userInfo.warnings.length){
		for (let i=0; i < userInfo.warnings.length; i++){
			if(!timeoutCheck(userInfo.warnings[i].date)) {
				newWarning.push(userInfo.warnings[i])
			}else{ edited.warning = true; }
		}
		userInfo.warnings = newWarning;
	}
	if (edited.ban || edited.warning) {
		console.log("Проверка на срок действий банов и предупреждений")
		let objTemplate = JSON.stringify(userInfo, null, 2);
		fs.writeFileSync(folder+user.info, objTemplate, (err) => { if(err) throw err; });
	}

}
module.exports = banAndWarningTimeoutCheck;