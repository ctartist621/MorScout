var fs = require("fs");

function getInput() {
	process.stdout.write("> ");
	process.stdin.resume();
	process.stdin.once("data", function(data) {
		var input = String(data).trim().split(" ");
		var cmd = input[0].toLowerCase();
		var user = input[1];
		var pass = input[2];
		var users = JSON.parse(fs.readFileSync("users.json"));
		if(cmd == "list") {
			for(var key in users) {
				console.log(key);
			}
		}
		else if(cmd == "logoutall") {
			for(var key in users) {
				users[key].tokens = [];
			}
		}
		else if(cmd == "logout") {
			if(check(user) && validUser(users, user)) {
				users[user].tokens = [];
			}
		}
		else if(cmd == "add") {
			if(check(user)) {
				if(users[user]) {
					console.log("already exists");
				}
				else {
					users[user] = {"pass" : "", "tokens" : []};
				}
			}
		}
		else if(cmd == "remove") {
			if(check(user) && validUser(users, user)) {
				delete users[user];
			}
		}
		else if(cmd == "changepass") {
			if(check(user) && check(pass) && validUser(users, user)) {
				users[user].pass = pass;
			}
		}
		else if(cmd == "exit") {
			process.exit();
		}
		else if(cmd == "help") {
			console.log("list, logoutAll, logout, add, remove, changePass, exit, help");
		}
		else {
			console.log("use help");
		}
		fs.writeFile("users.json", JSON.stringify(users));
		console.log("");
		getInput();
	});
}

function check(user) {
	if(!user) {
		console.log("please enter correct arguments");
		return false;
	}
	return true;
}

function validUser(users, user) {
	if(!users[user]) {
		console.log("user not found");
		return false;
	}
	return true;
}

getInput();