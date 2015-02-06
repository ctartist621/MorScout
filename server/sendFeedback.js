var http = require("http");
var fs = require("fs");

var feedback = JSON.parse(fs.readFileSync("feedback.json"));
var success = true;
for(var i = 0; i < feedback.length; i++) {
	http.request({
		host : "thevoidpigeon.heliohost.org",
		path : "/morscout.php?team=" + escape(feedback[i].team) + "&msg=" + escape(feedback[i].msg)
	}, function(res) {
		var data = "";
		res.on("data", function(chunk) {
			data += chunk;
		});
		res.on("end", function() {
			if(data != "success") {
				success = false;
			}
		});
	}).end();
}

if(success) {
	console.log("success");
	fs.writeFile("feedback.json", "[]");
}
else {
	console.log("error");
}

/* thevoidpigeon.heliohost.org/morscout.php

<?php
	if(isset($_GET["team"]) && isset($_GET["msg"])) {
		mail("morscout@team1515.org", $_GET["team"], $_GET["msg"], "From: feedback@team1515.org");
		echo "success";
	}
?>

*/