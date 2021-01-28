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

async function roleValidation(guild, user) {
	let userInfo = require(`./usersInfo/${user.info}`);

	if(userInfo.fix){
		console.log("Пользователь защищен от бота");
		return false;
	}

	if (!userInfo.ban.status){
		let roleList = [];

		let newRole = {
			add: await getRoleRank(userInfo.rank, rankList),
			actual: '',
			delete: []
		};

		guild.members.cache.get(userInfo.mainID).roles.cache.map(
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
			let member = guild.members.cache.get(`${userInfo.mainID}`);

			if (newRole.delete.length > 0){
				for (let i=0; i < newRole.delete.length; i++){
					let roleDelete = guild.roles.cache.find(role=>role.id == newRole.delete[i]);
					member.roles.remove(roleDelete);
				}
			}
			if (newRole.actual){
				let roleDelete = guild.roles.cache.find(role=>role.id == newRole.actual);
				member.roles.remove(roleDelete);
			}
			console.log("Установлена новая роль");
			let roleAdd = guild.roles.cache.find(role=>role.id == newRole.add.roleId);
			member.roles.add(roleAdd);
		}
	}
}

module.exports = roleValidation;