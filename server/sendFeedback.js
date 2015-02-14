var http = require("http");
var fs = require("fs");
var qs = require("querystring");

var feedback = JSON.parse(fs.readFileSync("feedback.json"));
var finished = Array(feedback.length).fill(false);
var success = true;
for(var i = 0; i < feedback.length; i++) {
	var index = i;
	http.request({
		host : "thevoidpigeon.heliohost.org",
		path : "/morscout.php?" + qs.stringify({
			team: feedback[i].team,
			msg: feedback[i].msg
		})
	}, function(res) {
		var data = "";
		res.on("data", function(chunk) {
			data += chunk;
		});
		res.on("end", function() {
			finished[index] = true;
			if(data != "success") {
				success = false;
			}
			if(finished.every(x => x)) {
				if(success) {
					console.log("success");
					fs.writeFile("feedback.json", "[]");
				}
				else {
					console.log("error");
				}
			}
		});
	}).end();
}
if(feedback.length == 0) {
	console.log("success");
}

/* thevoidpigeon.heliohost.org/morscout.php

<?php
	if(isset($_GET["team"]) && isset($_GET["msg"])) {
		mail("morscout@team1515.org", $_GET["team"], $_GET["msg"], "From: feedback@team1515.org");
		echo "success";
	}
?>

*/