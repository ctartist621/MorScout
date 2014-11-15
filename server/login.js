var http = require("http");
var url = require("url");
var fs = require("fs");
var qs = require("querystring");

http.createServer(function(req, res) {
	if(req.method == "POST") {
		req.on("data", function(data) {
			var arr = String(data).split("&");
			var user = null;
			var pass = null;
			for(var i = 0; i < arr.length; i++) {
				var split = arr[i].split("=");
				var name = qs.unescape(split[0]);
				var value =  qs.unescape(split[1]);
				if(name == "username") {
					user = value;
				}
				else if(name == "password") {
					pass = value;
				}
			}
			if(user != null && pass != null) {
				fs.readFile("users.json", "utf-8", function(err, data) {
					data = JSON.parse(data);
					for(var i = 0; i < data.length; i++) {
						if(data[i].user == user) {
							if(data[i].pass == pass) {
								res.end("successful login");
							}
							else {
								res.end("invalid password");
							}
						}
					}
					res.end("username not found");
				});
			}
			else {
				res.end("hello there");
			}
		});
	}
}).listen(99, "127.0.0.1");