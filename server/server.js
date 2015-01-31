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
	var data = readJSON("dataPoints.json");
	if(JSON.stringify(Object.keys(entry.data).sort()) != JSON.stringify([].concat(data.string, data.number, data.boolean).sort())) {
		return false;
	}
	for(var key in data) {
		for(var i = 0; i < data[key].length; i++) {
			if(typeof(entry.data[data[key][i]]) != key) {
				return false;
			}
		}
	}
	return true;
}

function addEntry(entry, user, data) {
	entry.meta.scout = user;
	entry.meta.checksum = getChecksum(entry.data);
	var team = entry.meta.team;
	var match = entry.meta.match;
	var scout = entry.meta.scout;
	data[team] = data[team] || {};
	data[team][match] = data[team][match] || {};
	data[team][match][scout] = data[team][match][scout] || [];
	var any = false;
	for(var i = 0; i < data[team][match][scout].length; i++) {
		if(data[team][match][scout][i].meta.checksum == entry.meta.checksum) {
			any = true;
			break;
		}
	}
	if(!any) {
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
	for(var i = 0; i < arr.length; i++) {
		result[arr[i]] = sortJSON(obj[arr[i]]);
	}
	return result;
}

function getChecksum(data) {
	return crypto.createHash("md5").update(JSON.stringify(sortJSON(data))).digest("hex");
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
	                	if(user.toLowerCase() == username.toLowerCase() && users[username].pass == pass) {
		                	var token = getToken(32);
		                	if(!users[username].tokens) {
			                	users[username].tokens = [];
		                	}
		                	users[username].tokens.push(token);
		                	writeJSON("users.json", users);
		        		sendQS(res, {"code" : 0, "user" : username, "token" : token, "data" : readJSON("data.json"), "matches" : readJSON("matches.json"), "teams" : readJSON("teams.json")});
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
				}
				else if(path == "/sync") {
					var entries = parseJSON(post.data);
					if(entries instanceof Array) {
						var data = readJSON("data.json");
						for(var i = 0; i < entries.length; i++) {
							var entry = entries[i];
							if(validEntry(entry)) {
								data = addEntry(entry, post.user, data);
							}
						}
						writeJSON("data.json", data);
						sendQS(res, {"code" : 0, "data" : data, "matches" : readJSON("matches.json"), "teams" : readJSON("teams.json")});
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
		for(var i = 0; i < obj[key].length; i++) {
			if(obj[key][i].family == "IPv4" && obj[key][i].address != "127.0.0.1") {
				console.log(obj[key][i].address);
			}
		}
	}
})();
