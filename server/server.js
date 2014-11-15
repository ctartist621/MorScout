var http = require("http");
var url = require("url");
var fs = require("fs");
var qs = require("querystring");

function sync(data, toSync) { // assumes valid data, etc
	for(var team in toSync) {
		if(!data[team]) data[team] = {};
		for(var match in toSync[team]) {
			if(!data[team][match]) data[team][match] = {};
			for(var scout in toSync[team][match]) {
				if(!data[team][match][scout]) data[team][match][scout] = [];
				for(var i = 0; i < toSync[team][match][scout].length; i++) {
					var repeat = false;
					for(var j = 0; j < data[team][match][scout].length; j++) {
						if(toSync[team][match][scout][i].meta.checksum == data[team][match][scout][j].meta.checksum) {
							repeat = true;
							break;
						}
					}
					if(!repeat) {
						data[team][match][scout].push(toSync[team][match][scout][i]);
					}
				}
				// apply default visibility, should it be organized by scout as well?
			}
		}
	}
	return data;
}

function getTeam(data, team) {
	return data[team];
}

function getTeamMatch(data, team, match) {
	return data[team][match];
}

function applyVisibility(data, team, match, scout, checksum, visible) {
	var arr = data[team][match][scout];
	for(var i = 0; i < arr.length; i++) {
		if(arr[i].meta.checksum == checksum) {
			arr[i].meta.visible = visible;
			break;
		}
	}
	return arr;
}

function lastEntries(team) {
	for(var matchNum in team) {
		var match = team[matchNum];
		if(match.length == 0) {
			team[matchNum] = {};
			continue;
		}
		var lastEntry = match[0];
		var lastStamp = lastEntry.meta.timestamp;
		for(var i = 1; i < match.length; i++) {
			var stamp = match[i].meta.timestamp;
			if(stamp >= lastStamp) {
				lastEntry = match[i];
				lastStamp = stamp;
			}
		}
		team[matchNum] = lastEntry;
	}
	return team;
}

function parseIfValid(entry) {
	if(!entry) return false;
	try {
		entry = JSON.parse(entry);
	}
	catch(err) {
		return false;
	}
	if(!entry.meta) return false;
	var team = entry.meta.team, match = entry.meta.match, scout = entry.meta.scout, timestamp = entry.meta.timestamp;
	for(var elem in [team, match, scout, timestamp]) if(typeof elem != "string") return false;
	if(String(parseInt(timestamp)) != timestamp) return false;
	if(typeof entry.data != "object") return false;
	// further validation of entry.data
	return entry;
}

function typeText(res) {
	res.writeHead(200, {"Content-Type" : "text/plain"});
}

function typeHtml(res) {
	res.writeHead(200, {"Content-Type" : "text/html"});
}

function getTeamData(teamName, cb) {
	if(teamName) fs.readFile("data.json", "utf-8", function(err, data) {
		var team = JSON.parse(data)[teamName];
		if(team) cb(JSON.stringify(lastEntries(team)));
		else cb("{}");
	});
	else cb('{"err":"Invalid team"}');
}

function getMatchData(teamName, matchNum, cb) {
	if(teamName && matchNum) fs.readFile("data.json", "utf-8", function(err, data) {
		var match = JSON.parse(data)[teamName][matchNum];
		if(match) cb(JSON.stringify(match));
		else cb("[]");
	});
	else cb('{"err":"Invalid team or match"}');
}

function addEntry(entry, cb) {
	entry = parseIfValid(entry);
	if(entry) {
		var team = entry.meta.team;
		var match = entry.meta.match;
		fs.readFile("data.json", "utf-8", function(err, data) {
			data = JSON.parse(data);
			if(!data[team]) data[team] = {};
			if(!data[team][match]) data[team][match] = [];
			data[team][match].push(entry);
			fs.writeFile("data.json", JSON.stringify(data));
			cb("Success");
		});
	}
	else cb("Invalid entry");
}

http.createServer(function(req, res) {
	var path = url.parse(req.url, true).pathname;
	if(req.method == "POST") {
		req.on("data", function(toSync) {
			toSync = qs.unescape(toSync);
			toSync = toSync.substring(5);
			console.log(toSync);
			toSync = JSON.parse(toSync);
			fs.readFile("data.json", "utf-8", function(err, data) {
				data = JSON.parse(data);
				data = sync(data, toSync);
				data = JSON.stringify(data);
				fs.writeFile("data.json", data);
				res.end("success");
			});
		});
	}
	else {
		var get = url.parse(req.url, true).query;
		if(path == "/") {
			typeHtml(res);
			fs.readFile("index.html", "utf-8", function(err, data) {
				res.end(data);
			});
		}
	}
}).listen(99, "127.0.0.1");

console.log("Running on 127.0.0.1:99");