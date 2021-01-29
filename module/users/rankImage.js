const {createCanvas, loadImage} = require('canvas');
const {MessageAttachment} = require('discord.js');

function even_or_odd(number, step) {
	if (number % 2 === 0){
		//целое
		return { img: { y: step, x: 10 },
					 title: { x: step+12, y: 36 },
					step: step }
	}else{
		return { img: { y: step, x: 210 },
			title: { x: step+12, y: 236 },
			step: step+26 }
	}
}

async function rankImage(info, msg, role=null) {
	let boardHeight = 80;
	if (info.awards.length) {
		boardHeight = 90 + 26 * Math.ceil(info.awards.length / 2);
	}

	if(info.avatar == 'https://cdn.discordapp.com/embed/avatars/1.png'){
		info.avatar = 'https://cdn.discordapp.com/attachments/706564776138113084/804439105680965662/02.jpg';
	}else if(info.avatar == 'https://cdn.discordapp.com/embed/avatars/2.png'){
		info.avatar = 'https://cdn.discordapp.com/attachments/706564776138113084/804439110424199198/04.jpg';
	}else if(info.avatar == 'https://cdn.discordapp.com/embed/avatars/3.png'){
		info.avatar = 'https://cdn.discordapp.com/attachments/706564776138113084/804439109535662080/03.jpg';
	}else if(info.avatar == 'https://cdn.discordapp.com/embed/avatars/4.png'){
		info.avatar = 'https://cdn.discordapp.com/attachments/706564776138113084/804439105357873162/01.jpg';
	}

	const canvas = createCanvas(400, boardHeight);
	const ctx = canvas.getContext("2d");

	ctx.strokeStyle = "#151515";
	ctx.fillStyle = "#151515";
	ctx.fillRect(0, 0, 400, 300);
	let bg = await loadImage(`https://cdn.discordapp.com/attachments/706564776138113084/804463872156237844/board.png`);
	ctx.drawImage(bg, 0,0, 400,300);

	/*
	Чисто для наград
	https://cdn.discordapp.com/attachments/706564776138113084/804463877139857488/board_2.png
	*/


	// аватар
	ctx.strokeStyle = "#ffffff";
	ctx.strokeRect(10, 10, 60, 60);

	let avatar = await loadImage(info.avatar);
	ctx.drawImage(avatar, 12,12, 56,56);

	//Ник
	ctx.font = "16px Arial";
	ctx.fillStyle = "#ffffff";
	ctx.fillText(info.nick, 80, 23);  //30
	ctx.fillText(info.name, 80, 43);  //60

	// Роль
	if (role){
		ctx.font = "13px Arial";
		ctx.fillStyle = "#c7b52c";
		ctx.fillText(role, 80, 67);  //30
	}

	//Предупреждения
	//info.warnings = 5;
	let warningPointPositionX = 343;
	for(let i=0; i < info.warnings; i++){
		let warningPoint = await loadImage(`https://cdn.discordapp.com/attachments/706564776138113084/804426900889796649/x-a.png`);
		ctx.drawImage(warningPoint, warningPointPositionX,20, 8,8);
		warningPointPositionX += 9
	}

	//Ранг
	ctx.font = "22px Arial";
	ctx.textAlign = "center";
	ctx.fillStyle = "#ffffff";
	ctx.fillText(`${info.rank}`, 268, 30);
	//Шкала
	ctx.strokeStyle = "#ffffff";
	ctx.strokeRect(220, 40, 100, 6);
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(220, 40, info.progress, 6);
	//Очки
	ctx.font = "14px Arial";
	ctx.textAlign = "center";
	ctx.fillStyle = "#ffffff";
	ctx.fillText(info.points +' xp', 269, 62);


	//Баны
	if(info.banStatus){
		let ban = await loadImage(`https://cdn.discordapp.com/attachments/706564776138113084/804426892857966632/ban-b.png`);
		ctx.drawImage(ban, 344,45, 42,21);
	}

	let banPointPositionX = 346;
	for(let i=0; i < info.bans; i++){
		let banPoint = await loadImage(`https://cdn.discordapp.com/attachments/706564776138113084/804426972070805594/banPoint-a.png`);
		ctx.drawImage(banPoint, banPointPositionX,35, 10,10);
		banPointPositionX += 16
	}

	/* Награды */

	let awardVerticalStep = 90;
	for(let i=0; i < info.awards.length; i++){
		let awardPosition = even_or_odd(i, awardVerticalStep);
		let awardPoint = await loadImage(info.awards[i].img);
		ctx.drawImage(awardPoint, awardPosition.img.x, awardPosition.img.y, 16,16);

		ctx.font = "12px Arial";
		ctx.textAlign = "left";
		ctx.fillStyle = "#a6a6a6";
		ctx.fillText(info.awards[i].title, awardPosition.title.y, awardPosition.title.x);

		awardVerticalStep = awardPosition.step;
	}
/*

	ctx.strokeStyle = "#ff0000";
	ctx.beginPath();
	ctx.arc(369, 43,2,0,Math.PI*2,true);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();
*/


	/*ctx.font = '30px Impact'
	ctx.rotate(0.1)
	ctx.fillText('Писюн Астрахана', 50, 100)*/

	const attachment = new MessageAttachment(canvas.toBuffer(), "rank.png");
	msg.channel.send(attachment)
}

module.exports = rankImage;