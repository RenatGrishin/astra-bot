const text = require('./text');

function randomInteger(max, min=0) {
	let rand = min - 0.5 + Math.random() * (max - min + 1);
	return Math.round(rand);
}

async function hiAndBye(say, user){
	let sendText = ""
	if(say == 'hi'){

		let hi = text.hi[randomInteger(text.hi.length-1)]
		sendText = `<@${user}> ${hi} ${text.info}`;
	}
	if(say == 'bye'){
		let bye = text.bye[randomInteger(text.bye.length-1)]
		sendText = `<@${user}> ${bye}`;
	}

	return sendText;
}

module.exports = hiAndBye;