var http = require("http");
var fs = require("fs");

http.request({
	host : "www.thebluealliance.com",
	path : "/api/v2/event/2010sc/matches",
	headers : {"X-TBA-App-Id" : "frc1515:MorScout:1"}
}, function(res) {
	var data = "";
	res.on("data", function(chunk) {
		data += chunk;
	});
	res.on("end", function() {
		data = JSON.parse(data);
		var result = {};
		for(var i = 0; i < data.length; i++) {
			result[data[i].match_number] = {
				"red" : data[i].alliances.red.teams.map(function(str) {
					return str.substring(3);
				}),
				"blue" : data[i].alliances.blue.teams.map(function(str) {
					return str.substring(3);
				})
			};
		}
		fs.writeFile("matches.json", JSON.stringify(result));
	});
}).end();