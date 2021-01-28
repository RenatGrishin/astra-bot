let checkFileUserInfo = require('./checkFileUserInfo');

async function getWarning(warnings){
	let warningPoints = 0;
	for(let i=0 ; i < warnings.length ; i++){
		if(warnings[i].active == true){
			warningPoints += warnings[i].priority;
		}
	}
	return warningPoints;
}

async function getAwards(awards, awardList){
	let list = [];
	for(let i=0; i < awards.length; i++){
		for(let j=0; j < awardList.length; j++){
			if(awards[i] == awardList[j].id){
				list.push(awardList[j]);
			}
		}
	}
	return list;
}

async function profileView(user, rankInfo) {
	let userInfo = require(`./usersInfo/${user.info}`);
	let userMessage = require(`./usersInfo/${user.messages}`);
	let awardsJSON = require('./awards/awards');

	//console.log(userInfo);

	let profile = {
		avatar: userInfo.avatar,
		nick: userInfo.nick,
		name: userInfo.name,
		messages: userMessage.messages,
		rank: userInfo.rank,
		points: rankInfo.points,
		progress: rankInfo.progress,
		warnings: userInfo.warnings.length,
		bans: userInfo.ban.count,
		banStatus: userInfo.ban.status,
		awards: []
	}

	if(userInfo.awards.length > 0){
		profile.awards = await getAwards(userInfo.awards, awardsJSON);
	}

	console.log(profile);

	return profile;
}

module.exports = profileView;