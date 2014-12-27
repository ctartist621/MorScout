var http = require("http");
var url = require("url");
var fs = require("fs");

var SERVER_IP = "127.0.0.1";
var SERVER_PORT = "8080";

var serverCalls = ["login", "logout", "allData", "allMatches", "sendEntry"]; // list of server calls

http.createServer(function(req, res) {
	var any = false;
	var path = url.parse(req.url, true).pathname;
	if(path == "/") {
		res.end(fs.readFileSync("/index.html"));
		any = true;
	}
	if(fs.existsSync(path) && path != "/middleman.js" && !any) {
		res.end(fs.readFileSync(path));
		any = true;
	}
	if(req.method == "POST") {
		for(var i = 0; i < serverCalls.length && !any; i++) {
			if(path == "/" + serverCalls[i]) {
				req.on("data", function(post) {
					var postReq = http.request({
						"host" : SERVER_IP,
						"port" : SERVER_PORT,
						"path" : "/" + serverCalls[i] + url.parse(req.url, true).search,
						"method" : "POST"
					}, function(result) {
						res.end(result);
					});
					postReq.write(String(post));
					postReq.end();
				});
				any = true;
			}
		}
	}
	if(!any) {
		res.end("error");
	}
}).listen(80, "127.0.0.1");