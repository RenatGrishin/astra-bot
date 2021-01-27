const {createCanvas, loadImage} = require('canvas');
const {MessageAttachment} = require('discord.js');

async function rankImage(msg, img) {

	let userObj = {
		avatar: img,
		nick: 'Шашлык',
		name: 'Артем',
		messages: 132346,
		rank: 19,
		points: 131904,
		progress: 40,
		warnings: 1,
		bans: 1,
		banStatus: false,
		awards: [
			{ id: 1, img: '1.png', title: 'Test Award', point: 7 },
			{ id: 3, img: '3.png', title: 'threeeeee', point: 11 }
		]
	}

	const canvas = createCanvas(400, 300);
	const ctx = canvas.getContext("2d");

	ctx.strokeStyle = "#103345";
	ctx.fillStyle = "#103345";
	ctx.fillRect(0, 0, 400, 300);

	// аватар
	ctx.strokeStyle = "#ffffff";
	ctx.strokeRect(10, 10, 60, 60);

	let avatar = await loadImage(userObj.avatar);
	ctx.drawImage(avatar, 12,12, 56,56);

	//Ник
	ctx.font = "16px Arial";
	ctx.fillStyle = "#ffffff";
	ctx.fillText(userObj.nick, 80, 30);
	ctx.fillText(userObj.name, 80, 60);

	//Предупреждения
	ctx.font = "16px Arial";
	ctx.fillStyle = "#ffea00";
	ctx.fillText("! ! ! ! !", 350, 30);

	//Ранг
	ctx.font = "22px Arial";
	ctx.fillStyle = "#ffffff";
	ctx.fillText(userObj.rank, 255, 30);
	//Шкала
	ctx.strokeStyle = "#ffffff";
	ctx.strokeRect(220, 40, 100, 6);
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(220, 40, userObj.progress, 6);
	//Очки
	ctx.font = "14px Arial";
	ctx.textAlign = "center";
	ctx.fillStyle = "#ffffff";
	ctx.fillText(userObj.points +' xp', 267, 62);

	//Баны
	ctx.font = "14px Arial";
	ctx.textAlign = "left";
	ctx.fillStyle = "#ff0000";
	ctx.fillText("BAN", 355, 65);

	ctx.strokeStyle = "#ff0000";
	ctx.strokeRect(349, 50, 40, 20);

	ctx.strokeStyle = "#ff0000";
	ctx.beginPath();
	ctx.arc(353, 43,3,0,Math.PI*2,true);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();

	ctx.strokeStyle = "#ff0000";
	ctx.beginPath();
	ctx.arc(369, 43,3,0,Math.PI*2,true);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();

	ctx.strokeStyle = "#ff0000";
	ctx.beginPath();
	ctx.arc(385, 43,3,0,Math.PI*2,true);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();


	/*ctx.font = '30px Impact'
	ctx.rotate(0.1)
	ctx.fillText('Писюн Астрахана', 50, 100)*/

	const attachment = new MessageAttachment(canvas.toBuffer(), "rank.png");
	msg.channel.send(attachment)
}

module.exports = rankImage;