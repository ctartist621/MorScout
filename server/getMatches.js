"use strict"

let http = require("http");
let fs = require("fs");

http.request({
	host : "www.thebluealliance.com",
	path : JSON.parse(fs.readFileSync("url.json")).matches,
	headers : {"X-TBA-App-Id" : "frc1515:MorScout:1"}
}, function(res) {
	let data = "";
	res.on("data", function(chunk) {
		data += chunk;
	});
	res.on("end", function() {
		data = JSON.parse(data);
		let result = {};
		for(let match of data) {
			result[match.match_number] = {
				red : match.alliances.red.teams.map(str => str.substring(3)),
				blue : match.alliances.blue.teams.map(str => str.substring(3)),
				time : match.time_string,
				timestamp : match.time
			};
		}
		fs.writeFile("matches.json", JSON.stringify(result));
	});
}).end();