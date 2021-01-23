let fs = require('fs');
let checkFileUserInfo = require('./checkFileUserInfo');
let folder = './module/users/usersInfo/';

async function addDaysDate(addDays){
	let dt = new Date();
	dt.setDate(dt.getDate() + addDays)

	return dt.getFullYear() +'-'+ (dt.getMonth()+1) +'-' +dt.getDate();
}

async function banAdd(msg, userID, description, dateEnd=null, userInfoJSON=null) {
	let userInfo = {};

	userID = String(userID).slice(3, -1);
	let user = msg.guild.members.cache.get(userID);
	let path = await checkFileUserInfo(user);

	if(userInfoJSON != null){
		userInfo = userInfoJSON;
	}else{
		userInfo = require(`./usersInfo/${path.info}`);
	}

	if(userInfo.fix) return false; //проверка на разрешение выдачи бана или предупреждений

	if(dateEnd==null && userInfoJSON){
		if(userInfo.ban.count == 0 && !userInfo.ban.status){
			userInfo.ban.status = true;
			userInfo.ban.count += 1;
			userInfo.ban.end = await addDaysDate(7);
			userInfo.ban.description = `В связи с этим ты получаешь бан на неделю. До **${await addDaysDate(7)}**`
		}else if(userInfo.ban.count == 1 && !userInfo.ban.status){
			userInfo.ban.status = true;
			userInfo.ban.count += 1;
			userInfo.ban.end = await addDaysDate(30);
			userInfo.ban.description = `В связи с этим ты получаешь бан на месяц. До **${await addDaysDate(30)}**`
		}else if(userInfo.ban.count == 2 && !userInfo.ban.status){
			userInfo.ban.status = true;
			userInfo.ban.count += 1;
			userInfo.ban.end = await addDaysDate(365);
			userInfo.ban.description = `Ууууу... Все сладенькай, ты получаешь вечный бан. \nНо если он выдан по ошибке, то отпишись админам, они все исправят. У тебя есть примерно неделя.`;
		}
	}
	if(dateEnd && userInfoJSON==null){
		userInfo.warnings = [];
		userInfo.ban.status = true;
		userInfo.ban.count += 1;
		userInfo.ban.end = dateEnd;
		userInfo.ban.description = description;
		if(userInfo.ban.count == 1){
			userInfo.ban.description += `\nВ первый раз не дикообраз. \nБан спадет **${dateEnd}**`;
		}else if(userInfo.ban.count == 2){
			userInfo.ban.description += `\nСладенькай, это уже 2ой бан. В следующий раз забаню навсегда. \nБан спадет **${dateEnd}**`;
		}else if(userInfo.ban.count == 3){
			userInfo.ban.description += `\nУуууу... Все сладенькай, ты получаешь вечный бан. \nНо если он выдан по ошибке, то отпишись админам, они все исправят. У тебя есть примерно неделя.`;
		}
	}

	let objTemplate = JSON.stringify(userInfo, null, 2);
	fs.writeFileSync(folder+path.info, objTemplate, (err) => { if(err) throw err; });

	return `<@!${userID}> Ты получаешь бан! Причина: \n${userInfo.ban.description}`

}

module.exports = banAdd;