var fs = require("fs");
var crypto = require("crypto");

(function getInput() {
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
			console.log("success");
		}
		else if(cmd == "logout") {
			if(user || console.log("usage: logout username")) {
				if(users[user] || console.log("user not found")) {
					users[user].tokens = [];
					console.log("success");
				}
			}
		}
		else if(cmd == "add") {
			if(user || console.log("usage: add username")) {
				if(users[user]) {
					console.log("user already exists");
				}
				else {
					users[user] = {"pass" : "", "tokens" : []};
					console.log("success");
				}
			}
		}
		else if(cmd == "remove") {
			if(user || console.log("usage: remove username")) {
				if(users[user] || console.log("user not found")) {
					delete users[user];
					console.log("success");
				}
			}
		}
		else if(cmd == "changepass") {
			if((user && pass) || console.log("usage: changePass username password")) {
				if(users[user] || console.log("user not found")) {
					users[user].pass = getHash(pass);
					console.log("success");
				}
			}
		}
		else if(cmd == "exit") {
			process.exit();
		}
		else if(cmd == "help") {
			console.log("commands: list, logoutAll, logout, add, remove, changePass, exit, help");
		}
		else {
			console.log("use help");
		}
		fs.writeFile("users.json", JSON.stringify(users));
		console.log("");
		getInput();
	});
})();

function getHash(data) {
	return crypto.createHash("md5").update(data).digest("hex");
}