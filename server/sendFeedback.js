"use strict"

let http = require("http");
let fs = require("fs");
let qs = require("querystring");

let feedback = JSON.parse(fs.readFileSync("feedback.json"));
let finished = Array(feedback.length).fill(false);
let success = true;
for(let i = 0; i < feedback.length; i++) {
	http.request({
		host : "thevoidpigeon.heliohost.org",
		path : "/morscout.php?" + qs.stringify({
			team: feedback[i].team,
			msg: feedback[i].msg
		})
	}, function(res) {
		let data = "";
		res.on("data", function(chunk) {
			data += chunk;
		});
		res.on("end", function() {
			finished[i] = true;
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