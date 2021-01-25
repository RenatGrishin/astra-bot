let checkFileUserInfo = require('./checkFileUserInfo');
let folder = './module/users/usersInfo/';
let rankList = require('./rank/rank');

async function getRoleRank (rank, list){
	for(let i=0; i < list.length; i++){
		if(list[i].rank == rank){
			return list[i];
		}
	}
}

async function roleValidation(msg, user, isBot=false, mainChannel=0) {
	let path = await checkFileUserInfo(user);
	let userInfo = require(`./usersInfo/${path.info}`);
	let msgBot = msg.guild;

	if (isBot) msgBot = msg.guilds.cache.find(key=>key == mainChannel)
	if(userInfo.fix) return false; // Защащен ли профиль

	if (!userInfo.ban.status){
		let roleList = [];

		let newRole = {
			add: await getRoleRank(userInfo.rank, rankList),
			actual: '',
			delete: []
		};

		msgBot.members.cache.get(userInfo.mainID).roles.cache.map(
			(role) => {
				if (role.id != "330779118427832320") roleList.push(role.id) // Если роль не everyone
			}
		);

		if (roleList.length > 0){
			for (let i=0; i < roleList.length; i++){
				if ( i == 0 ){
					newRole.actual = roleList[i];
				}else if(i > 0){
					newRole.delete.push(roleList[i]);
				}
			}
		}

		if (newRole.add != newRole.actual){
			let member = msgBot.members.cache.get(`${userInfo.mainID}`);

			if (newRole.delete.length > 0){
				for (let i=0; i < newRole.delete.length; i++){
					let roleDelete = msgBot.roles.cache.find(role=>role.id == newRole.delete[i]);
					member.roles.remove(roleDelete);
				}
			}
			if (newRole.actual){
				let roleDelete = msgBot.roles.cache.find(role=>role.id == newRole.actual);
				member.roles.remove(roleDelete);
			}
			console.log("Add Role: " +newRole.add);
			let roleAdd = msgBot.roles.cache.find(role=>role.id == newRole.add.roleId);
			member.roles.add(roleAdd);
		}
	}
}

module.exports = roleValidation;