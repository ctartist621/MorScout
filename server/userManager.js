"use strict"

let fs = require("fs");
let crypto = require("crypto");

function getInput() {
	process.stdout.write("> ");
	process.stdin.setRawMode(false);
	process.stdin.resume();
	process.stdin.once("data", function(data) {
		let input = String(data).trim().split(" ");
		let cmd = input[0].toLowerCase();
		let user = input[1];
		let users = JSON.parse(fs.readFileSync("users.json"));
		let wait = false;
		if(cmd == "list") {
			for(let key in users) {
				console.log(key);
			}
		}
		else if(cmd == "logoutall") {
			for(let key in users) {
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
					wait = true;
					changePass(users, user);
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
			if(user || console.log("usage: changePass username")) {
				if(users[user] || console.log("user not found")) {
					wait = true;
					changePass(users, user);
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
		if(!wait) {
			fs.writeFile("users.json", JSON.stringify(users));
			console.log("");
			getInput();
		}
	});
};

function getHash(data) {
	return crypto.createHash("md5").update(data).digest("hex");
}

function changePass(users, user) {
	process.stdin.setRawMode(true);
	process.stdin.resume();
	process.stdout.write("Enter the password:");
	let pass = "";
	let cb = function(char) {
		char = String(char);
		switch(char) {
			case "\n":
			case "\r":
				process.stdin.removeListener("data", cb);
				users[user].pass = getHash(pass);
				fs.writeFile("users.json", JSON.stringify(users));
				console.log("\nsuccess");
			case "\u0003":
				console.log();
				getInput();
				break;
			case String.fromCharCode(8):
				pass = pass.substring(0, pass.length - 1);
				break;
			default:
				pass += char;
				break;
		}
	};
	process.stdin.on("data", cb);
}

getInput();