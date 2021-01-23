async function commandGetParameter(message, sumParameters) {
	let messageParameters = message.split(' ', sumParameters);
	let sumDelete = 0;
	let sendParameters = [];

	for(let i=0; i < messageParameters.length; i++){
		sumDelete += messageParameters[i].length+1;
		if(i!=0) sendParameters.push(messageParameters[i]);
	}
	sendParameters.push(message.slice(sumDelete));

	return sendParameters;
}

module.exports = commandGetParameter;