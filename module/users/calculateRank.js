let fs = require('fs');
let folder = './module/users/usersInfo/'

function rank(rank, points){
	//points = 147;
	let rankInfo ={
		rank: 0,                  // Присвоенный ранг
		rankPoints: 0,            // Необходимые очки присвоенного ранга
		nextRankPoints: 0,        // Сколько нужно очков в целом для следующего ранга
		betweenRankPoints: 0,     // Разница очков между предыдущим и сл рангом
		leftoversPoints: points   // Сколько очков осталось после достижение ранга
	};

	if(points < 0){
		return {
			rank: rankInfo.rank,
			progress: 0
		}
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

async function calculateRank(user, warningFactor=5, banPoint=300) {

	let rankJSON = require('./rank/rank');
	let awardJSON = require('./awards/awards');
	let userInfo = require('./usersInfo/'+ user.info);
	let messages = require('./usersInfo/'+ user.messages);

	let infoAwards = userInfo.awards;
	let allAwardPoint = 0;
	let allWarningPoint = userInfo.warningPoint * warningFactor;

	/* Очки за Бан */
	let allBanPoint = userInfo.ban.count * banPoint;

	/* Очки за награды */
	for(let i=0 ; i < infoAwards.length ; i++){
		for(let j=0 ; j< awardJSON.length ; j++){
			if(awardJSON[j].id == infoAwards[i]){
				allAwardPoint += awardJSON[j].point;
			}
		}
	}


	let points = (messages.messages + allAwardPoint) - (allWarningPoint + allBanPoint);
	let rankPoints = rank(rankJSON, points);

	let userRank = {
		points: points,
		rank: rankPoints.rank,
		progress: rankPoints.progress
	}
	console.log(`Считаем ранг и записываем в файл`)

	userInfo.rank = userRank.rank;

	let objTemplate = JSON.stringify(userInfo, null, 2);
	fs.writeFileSync(folder+user.info, objTemplate, (err) => { if(err) throw err; });

	return userRank;
}

module.exports = calculateRank;