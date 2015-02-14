var http = require("http");
var url = require("url");
var fs = require("fs");
var qs = require("querystring");
var crypto = require("crypto");

function getToken(size) {
	var token = "";
	for(var i = 0; i < size; i++) {
		var rand = Math.floor(Math.random() * 62);
		token += String.fromCharCode(rand + ((rand < 26) ? 97 : ((rand < 52) ? 39 : -4)));
	}
	return token;
}

function validToken(user, token) {
	var users = readJSON("users.json");
	return users[user] && users[user].tokens && ~users[user].tokens.indexOf(token);
}

function validEntry(entry) {
	if(!entry.meta || typeof(entry.meta.team) != "string" || typeof(entry.meta.match) != "string" || typeof(entry.meta.time) != "number" || !entry.data) {
		return false;
	}
	var data = readJSON("dataPoints.json")[(entry.meta.match == "pit") ? "pit" : "match"];
	if(JSON.stringify(Object.keys(entry.data).sort()) != JSON.stringify([].concat(data.string, data.number, data.boolean).sort())) {
		return false;
	}
	for(var key in data) {
		for(var dataPoint of data[key]) {
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
	var team = entry.meta.team;
	var match = entry.meta.match;
	var scout = entry.meta.scout;
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
	var arr = Object.keys(obj).sort();
	var result = {};
	for(var elem of arr) {
		result[elem] = sortJSON(obj[elem]);
	}
	return result;
}

function getHash(data) {
	return crypto.createHash("md5").update(data).digest("hex");
}

function timeString() {
	var date = new Date();
	var hours = ((date.getHours() + 11) % 12 + 1);
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();
	return hours.toFixed(2) + ":" + minutes.toFixed(2) + ":" + seconds.toFixed(2);
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
	for(var key in json) {
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

http.createServer(function(req, res) {
	res.writeHead(200, {"Access-Control-Allow-Headers" : "Content-Type", "Access-Control-Allow-Origin" : "*"});
	var path = url.parse(req.url, true).pathname;
	if(req.method == "POST") {
		req.on("data", function(post) {
            post = qs.parse(String(post));
			if(path == "/login") {
				var user = post.user;
				var pass = post.pass;
                if(!user || !pass) {
	                sendQS(res, {"code" : 2});
                }
                else {
	                var users = readJSON("users.json");
	                var userFound = false;
	                for(var username in users) {
	                	if(user.toLowerCase() == username.toLowerCase() && users[username].pass == getHash(pass)) {
		                	var token = getToken(32);
		                	if(!users[username].tokens) {
			                	users[username].tokens = [];
		                	}
		                	users[username].tokens.push(token);
		                	writeJSON("users.json", users);
			        		sendQS(res, {"code" : 0, "user" : username, "token" : token, "data" : readJSON("data.json"), "matches" : readJSON("matches.json"), "teams" : readJSON("teams.json")});
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
					var users = readJSON("users.json");
					var user = post.user;
					var token = post.token;
					users[user].tokens.splice(users[user].tokens.indexOf(token), 1);
					writeJSON("users.json", users);
					sendQS(res, {"code" : 0});
					log("logout:\t" + post.user +"\t" + timeString());
				}
				else if(path == "/sync") {
					var entries = parseJSON(post.data);
					if(entries instanceof Array) {
						var data = readJSON("data.json");
						if(typeof(data) == "undefined") log("DATA UNDEFINED WHEN READING");
						var count = 0;
						for(var entry of entries) {
							if(validEntry(entry)) {
								data = addEntry(entry, post.user, data);
								count++;
							}
						}
						if(count > 0) console.log(count + " entr" + (count == 1 ? "y" : "ies") + " received");
						if(typeof(data) == "undefined") log("DATA UNDEFINED WHEN WRITING");
						writeJSON("data.json", data);
						var feedback = parseJSON(post.feedback);
						if(feedback instanceof Array) {
							var allFeedback = readJSON("feedback.json") || [];
							for(var item of feedback) {
								if(typeof(item.team) == "string" && typeof(item.msg == "string")) {
									allFeedback.push(item);
								}
							}
							writeJSON("feedback.json", allFeedback);
						}
						sendQS(res, {"code" : 0, "data" : data, "matches" : readJSON("matches.json"), "teams" : readJSON("teams.json")});
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
}).listen(8080, "0.0.0.0");

(function() {
	var obj = require("os").networkInterfaces();
	for(var key in obj) {
		for(var elem of obj[key]) {
			if(elem.family == "IPv4" && elem.address != "127.0.0.1") {
				console.log(elem.address);
			}
		}
	}
})();
console.log();