let fs = require('fs');
let checkFileUserInfo = require('./checkFileUserInfo');
let folder = './module/users/usersInfo/'
let todayDate = new Date();

/* Проверка даты предупреждений */
async function dateCheck (userWarning){
	let warnInfo = {
		allPriority: 0,
		allWarnings:[]
	};

	for(let i=0; i < userWarning.length; i++){
		if (Date.parse(userWarning[i].date) > todayDate) {
			warnInfo.allPriority += userWarning[i].priority;
			warnInfo.allWarnings.push(userWarning[i]);
		}
	}
	return warnInfo;
}

async function getWarning(content){
	let msgParameters = content.split(' ', 3);
	let sumDelete = 0;
	for(let i=0; i < msgParameters.length; i++){
		sumDelete += msgParameters[i].length+1;
	}
	let sendWarning = {
		priority: msgParameters[1],
		date: msgParameters[2],
		description: content.slice(sumDelete),
	}
	return sendWarning;
}

async function warningCheck(user, text) {
	let path = await checkFileUserInfo(user);
	let userInfo = require(`./usersInfo/${path.info}`);
	let warningInfo = {};
	let infoExport = {
		user: {},
		warning: {},
		ban: {},
	};


	let warning = await getWarning(text);

	let ban = {
		description: "Ты получил 5 предупреждений",
		date: "2021-10-23"
	}

	if(warning) {
		infoExport.warning = warning;

		userInfo.warnings.push(warning);
		userInfo.warningPoint += warning.priority;
	};
	if(userInfo.warnings.length>0) {
		warningInfo = await dateCheck(userInfo.warnings);
		if(warningInfo.allPriority >= 5){
			//warningInfo.allWarnings = [];

			infoExport.ban = ban;
		}
		userInfo.warnings = warningInfo.allWarnings;
	}

	infoExport.user = userInfo;

	console.log(infoExport)
	return infoExport;
}

module.exports = warningCheck;