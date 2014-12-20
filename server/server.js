var http = require("http");
var url = require("url");
var fs = require("fs");
var qs = require("querystring");

function getToken(size) {
	var token = "";
	for(var i = 0; i < size; i++) {
		var rand = Math.floor(Math.random() * 62);
		if(rand < 26) {
			token += String.fromCharCode(rand + 97);
		}
		else if(rand < 52) {
			token += String.fromCharCode(rand + 39);
		}
		else {
			token += String.fromCharCode(rand - 4);
		}
	}
	return token;
}

var loggedIn = {}

function validate(user, token) {
	return loggedIn[user] && loggedIn[user].token == token;
}

function logIn(user, pass, cb) {
	if(user && pass) {
		fs.readFile("users.json", "utf-8", function(err, data) {
			data = JSON.parse(data);
			for(var i = 0; i < data.length; i++) {
				if(data[i].user == user) {
					if(data[i].pass == pass) {
						if(loggedIn[user]) {
							cb({"code" : 1});
						}
						else {
							var token = getToken(32);
							loggedIn[user] = {
								"token" : token,
								"loginTime" : Date.now()
							}
							cb({"code" : 0, "token" : token});
						}
					}
					else {
						cb({"code" : 2});
					}
				}
			}
			cb({"code" : 3});
		});
	}
	else {
		cb({"code" : 4});
	}
}

function logOut(user) {
	delete loggedIn[user];
}

function webFormat(result, query) {
	if(query.webCb) {
		return "(" + query.webCb + ")(" + JSON.stringify(result) + ");";
    }
	else {
		return JSON.stringify(result);
	}
}

http.createServer(function(req, res) {
	var path = url.parse(req.url, true).pathname;
	var query = qs.parse(url.parse(req.url, true).query);
    console.log("server start");
	if(req.method == "POST") {
        console.log("POST entered");
		req.on("data", function(data) {
			console.log("function data");
            var post = qs.parse(String(data));
            console.log(path);
			if(path == "/login") {
                console.log("Login code");
				logIn(post.username, post.password, function(result) {
					res.end(qs.stringify(result));
				});
			}
			else if(path == "/logout") {
				if(validate(post.username, post.password)) {
					logout(post.username);
				}
				res.end("success");
			}
		});
	}
	else if(path == "/allMatches") {
		fs.readFile("matches.json", "utf-8", function(err, data) {
			res.end(webFormat({"code" : 0, "data" : JSON.parse(data)}, query));
		});
	}
}).listen(8080, "0.0.0.0");
