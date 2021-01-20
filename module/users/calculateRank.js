let fs = require('fs');
let checkFileUserInfo = require('./checkFileUserInfo');

function rank(rank, points){
	points = 147;
	let rankInfo ={
		rank: 0,                  // Присвоенный ранг
		rankPoints: 0,            // Необходимые очки присвоенного ранга
		nextRankPoints: 0,        // Сколько нужно очков в целом для следующего ранга
		betweenRankPoints: 0,     // Разница очков между предыдущим и сл рангом
		leftoversPoints: points   // Сколько очков осталось после достижение ранга
	};

	if(points < 0){
		rankInfo.rank = 0;
		rankInfo.rankPoints = 0;
		rankInfo.nextRankPoints = rank[1].points;
		rankInfo.betweenRankPoints = rank[1].points;
		rankInfo.leftoversPoints = 0;
		return rankInfo;
	}

	for(let i=0 ; i < rank.length ; i++){
		if(points >= rank[i].points){
			rankInfo.rank = rank[i].rank;
			rankInfo.rankPoints = rank[i].points;
			if(rank[i+1]){
				rankInfo.nextRankPoints = rank[i+1].points;
			}
		}
	}

	rankInfo.betweenRankPoints = rankInfo.nextRankPoints - rankInfo.rankPoints;
	if(rankInfo.betweenRankPoints == 0) {
		rankInfo.betweenRankPoints = 10
		rankInfo.leftoversPoints = 0;
	}else {
		rankInfo.leftoversPoints = points - rankInfo.rankPoints;
	}

	return {
		rank: rankInfo.rank,
		progress: Math.round(rankInfo.leftoversPoints / rankInfo.betweenRankPoints * 100)
	}
}

async function calculateRank(user, warningPoint=5, banPoint=300) {
	let path = await checkFileUserInfo(user)

	let rankJSON = require('./rank/rank');
	let awardJSON = require('./awards/awards');
	let info = require('./usersInfo/'+ path.info);
	let messages = require('./usersInfo/'+ path.messages);
	let warnings =  require('./usersInfo/'+ path.warnings);

	let infoAwards = info.awards;
	let allAwardPoint = 0;
	let allWarningPoint = 0;

	/* Очки за Бан */
	let allBanPoint = info.ban.count * banPoint;

	/* Очки за награды */
	for(let i=0 ; i < infoAwards.length ; i++){
		for(let j=0 ; j< awardJSON.length ; j++){
			if(awardJSON[j].id == infoAwards[i]){
				allAwardPoint += awardJSON[j].point;
			}
		}
	}

	/* Очки за предупреждения */
	for(let i=0 ; i < warnings.length ; i++){
		allWarningPoint += warnings[i].priority * warningPoint;
	}

	let points = (messages.messages + allAwardPoint) - (allWarningPoint + allBanPoint);
	let rankPoints = rank(rankJSON, points);

	let userRank = {
		points: points,
		rank: rankPoints.rank,
		progress: rankPoints.progress
	}

	return userRank;
}

module.exports = calculateRank;