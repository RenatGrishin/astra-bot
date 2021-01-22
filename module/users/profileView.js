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

async function profileView(user, userCart, rankInfo) {
	let path = await checkFileUserInfo(user);
	let userMessage = require(`./usersInfo/${path.messages}`);
	let awardsJSON = require('./awards/awards');

	console.log(userCart);

	let profile = {
		avatar: userCart.avatar,
		nick: userCart.nick,
		name: userCart.name,
		messages: userMessage.messages,
		rank: userCart.rank,
		points: rankInfo.points,
		progress: rankInfo.progress,
		warnings: userCart.warnings.length,
		bans: userCart.ban.count,
		banStatus: userCart.ban.status,
		awards: []
	}

	if(userCart.awards.length > 0){
		profile.awards = await getAwards(userCart.awards, awardsJSON);
	}

	console.log(profile);

	return profile;
}

module.exports = profileView;