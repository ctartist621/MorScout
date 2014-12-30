/*
var nameD = document.createElement('li');
var nameDA = document.createElement('a');
var nameDText = document.createTextNode(localStorage.user);
nameD.appendChild(nameDText);
nameD.appendChild(nameDA);
nameDA.class = "rightlinks";
nameDA.href = "#";
document.body.appendChild(nameD);

var nameDText = document.createTextNode(localStorage.user);
document.body.appendChild(nameDText);
*/
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

$(document).ready(function() {
	if(localStorage.user !== undefined){
	
		//var downArrow = document.createElement('span');
		//downArrow.class = 'caret';
		var userD = document.createTextNode(" " + localStorage.user);
		
		//document.getElementById('nameD').appendChild(downArrow);
		
		
		document.getElementById("UserDropdown").innerHTML = '<a id = "nameD" href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><span class="caret"></span></a><ul class="dropdown-menu" role="menu"><li><a href="#" id="view_prof">View Profile</a></li><li class="divider"></li><li><a href="#" id="logout">Log out</a></li></ul>'
		document.getElementById('nameD').appendChild(userD);
		document.getElementById("logout").onclick = function() {
			
			ajax("http://192.168.0.8:8080/logout", {}, {"user" : localStorage.user, "token" : localStorage.token}, function(result) {
				if(result.code == 0) {
					localStorage.removeItem('user');
					localStorage.removeItem('token');
					location = "index.html";
				}
				else if(result.code == 1) {
					alert("invalid token");
				}
				else {
					alert("oops");
				}
			});
			return false;
			
		}
		document.getElementById("view_prof").onclick = function() {
			alert("Hello and have a good day, " + localStorage.user + "\nToken: " + localStorage.token + "\nLogged in indefinitely.");
		}
	} else if (sessionStorage.user !== undefined) {
		
		//var downArrow = document.createElement('span');
		//downArrow.class = 'caret';
		var userD = document.createTextNode(" " + sessionStorage.user);
		document.getElementById("UserDropdown").innerHTML = '<a id = "nameD" href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><span class="caret"></span></a><ul class="dropdown-menu" role="menu"><li><a href="#" id="view_prof">View Profile</a></li><li class="divider"></li><li><a href="#" id="logout">Log out</a></li></ul>'
		document.getElementById('nameD').appendChild(userD);
		//document.getElementById('nameD').appendChild(userD);
		
		
		
		document.getElementById("logout").onclick = function() {
			
			ajax("http://192.168.0.8:8080/logout", {}, {"user" : sessionStorage.user, "token" : sessionStorage.token}, function(result) {
				if(result.code == 0) {
					sessionStorage.removeItem('user');
					sessionStorage.removeItem('token');
					location = "index.html";
				}
				else if(result.code == 1) {
					alert("invalid token");
				}
				else {
					alert("oops");
				}
			});
			return false;
			
		}
		document.getElementById("view_prof").onclick = function() {
			alert("Hello and have a good day, " + sessionStorage.user + "\nToken: " + sessionStorage.token + "\nLogged in for 1 session.");
		}
	}

	
	
});

