"use strict";

let http = require("http");
let url = require("url");
let fs = require("fs");
let qs = require("querystring");
let crypto = require("crypto");

let port = process.argv.length > 2 ? process.argv[2] : 8080;

function getToken(size) {
	let token = "";
	for(let i = 0; i < size; i++) {
		let rand = Math.floor(Math.random() * 62);
		token += String.fromCharCode(rand + ((rand < 26) ? 97 : ((rand < 52) ? 39 : -4)));
	}
	return token;
}

function validToken(user, token) {
	let users = readJSON("users.json");
	return users[user] && users[user].tokens && ~users[user].tokens.indexOf(token);
}

function validEntry(entry) {
	if(!entry.meta || typeof(entry.meta.team) != "string" || typeof(entry.meta.match) != "string" || typeof(entry.meta.time) != "number" || !entry.data) {
		return false;
	}
	let data = readJSON("dataPoints.json")[(entry.meta.match == "pit") ? "pit" : "match"];
	if(JSON.stringify(Object.keys(entry.data).sort()) != JSON.stringify([].concat(data.string, data.number, data.boolean).sort())) {
		return false;
	}
	for(let key in data) {
		for(let dataPoint of data[key]) {
			if(typeof(entry.data[dataPoint]) != key) {
				console.log(dataPoint);
				return false;
			}
		}
	}
	return true;
}

function addEntry(entry, user, data) {
	entry.meta.scout = user;
	entry.meta.checksum = getHash(JSON.stringify(sortJSON(entry.data)));
	let team = entry.meta.team;
	let match = entry.meta.match;
	let scout = entry.meta.scout;
	data = data || {};
	data[team] = data[team] || {};
	data[team][match] = data[team][match] || {};
	data[team][match][scout] = data[team][match][scout] || [];
	if(!data[team][match][scout].some(report => report.meta.checksum == entry.meta.checksum)) {
		data[team][match][scout].push(entry);
	}
	return data;
}

function sortJSON(obj) {
	if(typeof(obj) != "object" || obj instanceof Array) {
		return obj;
	}
	let arr = Object.keys(obj).sort();
	let result = {};
	for(let elem of arr) {
		result[elem] = sortJSON(obj[elem]);
	}
	return result;
}

function getHash(data) {
	return crypto.createHash("md5").update(data).digest("hex");
}

function timeString() {
	let twoDigits = num => (num < 10 ? "0" : "") + num;
	let date = new Date();
	let hours = ((date.getHours() + 11) % 12 + 1);
	let minutes = date.getMinutes();
	let seconds = date.getSeconds();
	return twoDigits(hours) + ":" + twoDigits(minutes) + ":" + twoDigits(seconds);
}

function parseJSON(str) {
	try {
		return JSON.parse(str);
	}
	catch(err) {
		return undefined;
	}
}

function sendQS(res, json) {
	for(let key in json) {
		if(typeof(json[key]) == "object") {
			json[key] = JSON.stringify(json[key]);
		}
	}
	res.end(qs.stringify(json));
}

function readJSON(file) {
	return parseJSON(fs.readFileSync(file));
}

function writeJSON(file, json) {
	fs.writeFile(file, JSON.stringify(json));
}

function log(line) {
	console.log(line);
	fs.appendFile("log.txt", line + "\n");
}

let lastSync = 0:

http.createServer(function(req, res) {
	res.writeHead(200, {"Access-Control-Allow-Headers" : "Content-Type", "Access-Control-Allow-Origin" : "*"});
	let path = url.parse(req.url, true).pathname;
	if(req.method == "POST") {
		req.on("data", function(post) {
            post = qs.parse(String(post));
			if(path == "/login") {
				let user = post.user;
				let pass = post.pass;
                if(!user || !pass) {
	                sendQS(res, {"code" : 2});
                }
                else {
	                let users = readJSON("users.json");
	                let userFound = false;
	                for(let username in users) {
	                	if(user.toLowerCase() == username.toLowerCase() && users[username].pass == getHash(pass)) {
		                	let token = getToken(32);
		                	if(!users[username].tokens) {
			                	users[username].tokens = [];
		                	}
		                	users[username].tokens.push(token);
		                	writeJSON("users.json", users);
							sendQS(res, {
								"code" : 0,
								"user" : username,
								"token" : token,
								"data" : readJSON("data.json"),
								"matches" : readJSON("matches.json"),
								"teams" : readJSON("teams.json"),
								"team" : parseInt(fs.readFileSync("team.txt"))
							});
							log("login:\t" + username + "\t" + timeString());
							userFound = true;
							break;
	                	}
	                }
	                if(!userFound) {
		                sendQS(res, {"code" : 1});
	                }
                }
			}
			else if(validToken(post.user, post.token)) {
				if(path == "/logout") {
					let users = readJSON("users.json");
					let user = post.user;
					let token = post.token;
					users[user].tokens.splice(users[user].tokens.indexOf(token), 1);
					writeJSON("users.json", users);
					sendQS(res, {"code" : 0});
					log("logout:\t" + post.user +"\t" + timeString());
				}
				else if(path == "/sync") {
					if(lastSync + 1000 < Date.now()) {
                    	lastSync = Date.now();
						let entries = parseJSON(post.data);
						let data = readJSON("data.json");
						if(typeof(data) == "undefined") log("DATA UNDEFINED WHEN READING");
						if(entries instanceof Array) {
							let count = 0;
							for(let entry of entries) {
								if(validEntry(entry)) {
									data = addEntry(entry, post.user, data);
									count++;
								}
							}
							if(count > 0) log(count + " entr" + (count == 1 ? "y" : "ies") + " received");
						}
						let deleted = parseJSON(post.deleted);
						if(deleted instanceof Array && post.user.toLowerCase() == "admin") {
							for(let obj of deleted) {
								let team = obj.team;
								let match = obj.match;
								let scout = obj.scout;
								if(data[team] && data[team][match] && data[team][match][scout]) {
									data[team][match][scout] = data[team][match][scout].filter(report => report.meta.checksum != obj.checksum);
								}
							}
							if(deleted.length > 0) log(deleted.length + " entr" + (deleted.length == 1 ? "y" : "ies") + " deleted");
						}
						if(typeof(data) == "undefined") log("DATA UNDEFINED WHEN WRITING");
						writeJSON("data.json", data);
						let feedback = parseJSON(post.feedback);
						if(feedback instanceof Array) {
							let allFeedback = readJSON("feedback.json") || [];
							for(let item of feedback) {
								if(typeof(item.team) == "string" && typeof(item.msg == "string")) {
									allFeedback.push(item);
								}
							}
							writeJSON("feedback.json", allFeedback);
						}
						sendQS(res, {
							"code" : 0,
							"data" : data,
							"matches" : readJSON("matches.json"),
							"teams" : readJSON("teams.json"),
							"team" : parseInt(fs.readFileSync("team.txt"))
						});
						log("sync:\t" + post.user + "\t" + timeString());
					}
					else {
						sendQS(res, {"code" : 2});
					}
				}
			}
			else {
				sendQS(res, {"code" : 1});
			}
		});
	}
	else if(path == "/ping") {
		res.end("pong");
	}
	else {
		sendQS(res, {"code" : 2});
	}
}).listen(port, "0.0.0.0");

(function() {
	let obj = require("os").networkInterfaces();
	for(let key in obj) {
		for(let elem of obj[key]) {
			if(elem.family == "IPv4" && elem.address != "127.0.0.1") {
				console.log(elem.address + ":" + port);
			}
		}
	}
})();
console.log();
