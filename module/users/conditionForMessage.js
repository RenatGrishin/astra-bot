function conditionForMessage (message, prefix) {
	let wordCount = message.split(' ', 4)

	if(wordCount.length !== 4) return false;

	let firstWord = wordCount[0].split('', 1)

	for(let i=0 ; i < prefix.length ; i++){
		if(prefix[i] == firstWord) return false;
	}

	return true;
}

module.exports = conditionForMessage;