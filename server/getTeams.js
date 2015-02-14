var http = require("http");
var fs = require("fs");

http.request({
	host : "www.thebluealliance.com",
	path : JSON.parse(fs.readFileSync("url.json")).teams,
	headers : {"X-TBA-App-Id" : "frc1515:MorScout:1"}
}, function(res) {
	var data = "";
	res.on("data", function(chunk) {
		data += chunk;
	});
	res.on("end", function() {
		data = JSON.parse(data);
		var result = {};
		for(var team of data) {
			result[team.team_number] = team.nickname;
		}
		fs.writeFile("teams.json", JSON.stringify(result));
	});
}).end();