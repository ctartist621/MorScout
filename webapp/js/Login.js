function getQS(obj) {
	var arr = Object.keys(obj);
	for(var i = 0; i < arr.length; i++) {
		arr[i] = escape(arr[i]) + "=" + escape(obj[arr[i]]);
	}
	return arr.join("&");
}
function parseQS(str) {
	var arr = str.split("&");
	var obj = {};
	for(var i = 0; i < arr.length; i++) {
		var pair = arr[i].split("=");
		obj[unescape(pair[0])] = unescape(pair[1] || "");
	}
	return obj;
}
function ajax(url, get, post, cb) {
	var qs = getQS(get);
	if(qs != "") {
		url += "?" + qs;
	}
	var xhr = new XMLHttpRequest() || new XDomainRequest();
	xhr.onload = function() {
		if(cb) {
			cb(parseQS(xhr.responseText));
		}
	};
	xhr.open("POST", url, true);
	xhr.send(getQS(post));
}
document.getElementById("login_form").onsubmit = function() {
	if($('#check_box').is(':checked')){

		var user = document.getElementById("username").value;
		var pass = document.getElementById("password").value;
		
		ajax("http://" + localStorage.ip + ":8080/login", {}, {"user" : user, "pass" : pass}, function(result) {
			if(result.code == 0) {
				localStorage.user = result.user;
				localStorage.token = result.token;
				location = "index.html";
			}
			else if(result.code == 1) {
				alert("invalid username and password");
			}
			else {
				alert("oops");
			}
		});
		
	} else {
		
		var user = document.getElementById("username").value;
		var pass = document.getElementById("password").value;
		
		ajax("http://" + localStorage.ip + ":8080/login", {}, {"user" : user, "pass" : pass}, function(result) {
			if(result.code == 0) {
				sessionStorage.user = result.user;
				sessionStorage.token = result.token;
				location = "index.html";
			}
			else if(result.code == 1) {
				alert("invalid username and password");
			}
			else {
				alert("oops");
			}
		});

	}	
	return false;
};
