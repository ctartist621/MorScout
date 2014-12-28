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

function equalArrays(a, b) {
	if(a.length != b.length) {
		return false;
	}
	for(var i = 0; i < a.length; i++) {
		if(!~b.indexOf(a[i])) {
			return false;
		}
	}
	return true;
}

function validToken(user, token) {
	var users = readJSON("users.json");
	return users[user] && users[user].tokens && ~users[user].tokens.indexOf(token);
}

function validEntry(entry) {
	if(!entry.meta || !entry.meta.team || !entry.meta.match || !entry.meta.scout || !entry.data || !entry.meta.time) {
		return false;
	}
	var data = readJSON("dataPoints.json");
	if(!equalArrays(Object.keys(entry.data).sort(), [].concat(data.string, data.number, data.boolean).sort())) {
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

function sortJSON(obj) {
	if(typeof(obj) != "object") {
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

function sendQS(res, json) {
	for(var key in json) {
		if(typeof(json[key]) == "object") {
			json[key] = JSON.stringify(json[key]);
		}
	}
	res.end(qs.stringify(json));
}

function readJSON(file) {
	return JSON.parse(fs.readFileSync(file));
}

function writeJSON(file, json) {
	fs.writeFile(file, JSON.stringify(json));
}

http.createServer(function(req, res) {
	res.writeHead(200, {"Access-Control-Allow-Origin" : "*"});
	var path = url.parse(req.url, true).pathname;
	var get = url.parse(req.url, true).query;
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
	                if(users[user] && users[user].pass == pass) {
		                var token = getToken(32);
		                if(!users[user].tokens) {
			                users[user].tokens = [];
		                }
		                users[user].tokens.push(token);
		                writeJSON("users.json", users);
		                sendQS(res, {"code" : 0, "user" : user, "token" : token});
	                }
	                else {
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
				else if(path == "/allData") {
					sendQS(res, {"code" : 0, "data" : readJSON("data.json")});
				}
				else if(path == "/allMatches") {
					sendQS(res, {"code" : 0, "data" : readJSON("matches.json")});
				}
				else if(path == "/sendEntry") {
					var entry = JSON.parse(post.data);
					if(entry) {
						if(validEntry(entry)) {
							entry.meta.checksum = getChecksum(entry.data);
							var data = readJSON("data.json");
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
								writeJSON("data.json", data);
							}
							sendQS(res, {"code" : 0});
						}
						else {
							sendQS(res, {"code" : 3});
						}
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
	else { // what to do here
		fs.readFile("test.html", function(err, data) {
			res.end(data);
		});
	}
}).listen(8080, "0.0.0.0");
