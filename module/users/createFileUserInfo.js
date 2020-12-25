let fs = require('fs');
const template = require('./usersInfo/template');
let path = './module/users/usersInfo/'


let createFileUserInfo=(userId='1')=>{
	let pathUser = path + userId+'.json';
	//let pathTemplate = path + 'template' + '.json';
	let objTemplate = JSON.stringify(template, null, 2);

	if(fs.existsSync(pathUser)){
		console.log("Типа файл есть");
	}else{
		fs.open(pathUser, "w", (err) => { if(err) throw err; });
		fs.writeFile(pathUser, objTemplate, (err) => { if(err) throw err; });
		console.log("Файл с пользователем создан.");
	}


	//let objTemplate = JSON.stringify(template, null, 2);

	//let objTemplate = JSON.stringify(template, null, 2);
	//console.log(path)
}

// Есть ли файл с таким id
//  Д – прописать инфу
//  Н - проверить на соответствие с шаблоном
//   Д - Прописать инфу
//   Н – Прописать недостающие теги и записать инфу

module.exports = createFileUserInfo;
