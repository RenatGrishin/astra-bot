let fs = require('fs');
let checkFileUserInfo = require('./checkFileUserInfo');
let folder = './module/users/usersInfo/';
let todayDate = new Date();

/* Проверка даты предупреждений */
async function dateCheck (userWarning){
	let warnInfo = {
		allPriority: 0,
		allWarnings:[]
	};

	for(let i=0; i < userWarning.length; i++){
		if (Date.parse(userWarning[i].date) > todayDate) {
			warnInfo.allPriority += Number(userWarning[i].priority);
			warnInfo.allWarnings.push(userWarning[i]);
		}
	}
	return warnInfo;
}

async function warningAdd(msg, parameters) {
	parameters[0] = parameters[0].slice(3, -1);
	let user = msg.guild.members.cache.get(parameters[0]);
	let path = await checkFileUserInfo(user);
	let userInfo = require(`./usersInfo/${path.info}`);

	if(userInfo.fix) return false; //проверка на разрешение выдачи бана или предупреждений

	let warningInfo = {};
	let infoExport = {
		user: {},
		warning: {},
		ban: null
	};
	let newWarning = {
		description: parameters[3],
		priority: parameters[1],
		date: parameters[2]
	}

	if(newWarning) {
		infoExport.warning = newWarning;

		userInfo.warnings.push(newWarning);
		userInfo.warningPoint = Number(userInfo.warningPoint)
		userInfo.warningPoint += Number(newWarning.priority);
	};
	if(userInfo.warnings.length>0) {
		warningInfo = await dateCheck(userInfo.warnings);
		if(warningInfo.allPriority >= 5){
			warningInfo.allWarnings = [];
			infoExport.ban = {
				userID: '<@!'+ parameters[0] +'>',
				end: '',
				description: 'у тебя скопилось до 5 предупредительных балов'
			}

		}
		userInfo.warnings = warningInfo.allWarnings;
	}

	infoExport.user = userInfo;

	if(!infoExport.ban){
		let objTemplate = JSON.stringify(infoExport.user, null, 2);
		fs.writeFileSync(folder+path.info, objTemplate, (err) => { if(err) throw err; });
	}

	return infoExport;
}

module.exports = warningAdd;