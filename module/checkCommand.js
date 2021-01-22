async function checkCommand(command, prefix, word) {
	for(let i=0; i < word.length; i++){
		if(command == prefix + word[i].toLowerCase()){
			let cmd = prefix + word[i];
			return cmd.length+1;
		}
	}
	return false;
}

module.exports = checkCommand;