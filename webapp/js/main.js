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
function ajax(url, get, post, cb, err) {
	var qs = getQS(get);
	if(qs != "") {
		url += "?" + qs;
	}
	var xhr = new XMLHttpRequest() || new XDomainRequest();
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4) {
			if(cb && xhr.status >= 200 && xhr.status < 400) {
				cb(parseQS(xhr.responseText));
			}
			else if(err) {
				err();
			}
		}
	};
	xhr.open("POST", url, true);
	xhr.send(getQS(post));
}
function sync(){
	ajax("http://" + localStorage.ip + ":" + localStorage.port + "/sync", {}, {"user": localStorage.user || sessionStorage.user, "token": localStorage.token || sessionStorage.token, "data": localStorage.unSynced || "[]"}, function(result){
		if(result.code == 0){
			localStorage.data = result.data;
			localStorage.matches = result.matches;
			localStorage.teams = result.teams;
			localStorage.unSynced = "[]";
			$('#loading').html("Done!");
			console.log("synced");
		}else if(result.code == 1){
			$('#loading').html('Log in first!');
			setTimeout(function() {
				location = "login.html";
			}, 1000);
		}else{
			$('#loading').html('Internal Error');
		}
	}, function() {
		$('#loading').html('Error connecting to server');
	});
}
function autoSync(){
	ajax("http://" + localStorage.ip + ":" + localStorage.port + "/sync", {}, {"user": localStorage.user || sessionStorage.user, "token": localStorage.token || sessionStorage.token, "data": localStorage.unSynced || "[]"}, function(result){
		if(result.code == 0){
			localStorage.data = result.data;
			localStorage.matches = result.matches;
			localStorage.teams = result.teams;
			localStorage.unSynced = "[]";
			console.log("synced");
		}else if(result.code == 1){
			console.log("cant sync -> not logged in")
		}else{
			console.log("cant sync -> internal error")
		}
	}, function() {
		$('#loading').html('Error connecting to server');
	});
}

Array.prototype.last = function() {
	return this[this.length - 1];
};

$(document).ready(function() {
	if(navigator.onLine){
		autoSync();
	}	
	if($(window).width()<768){
		$('.current_page').show();
	}else{
		$('.current_page').hide();
	}
	if(localStorage.user !== undefined){
	
		var userD = document.createTextNode(" " + localStorage.user);
		document.getElementById("UserDropdown").innerHTML = '<a id = "nameD" href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><span class="caret"></span></a><ul class="dropdown-menu" role="menu"><li><a href="#" id="view_prof">View Profile</a></li><li><a href="#" id="logout">Log Out</a></li></ul>'
		document.getElementById('nameD').appendChild(userD);
		document.getElementById("logout").onclick = function() {
			ajax("http://" + localStorage.ip + ":" + localStorage.port + "/logout", {}, {"user" : localStorage.user, "token" : localStorage.token}, function(result) {
				if(result.code == 0) {
					localStorage.removeItem('user');
					localStorage.removeItem('token');
					localStorage.hasLoggedIn = false;
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
			alert("Hello and have a good day, " + localStorage.user + "\nToken: " + localStorage.token + "\nLogged in indefinitely.\nIP: " + localStorage.ip+":"+localStorage.port);
		}
	} else if (sessionStorage.user !== undefined) {
		
		var userD = document.createTextNode(" " + sessionStorage.user);
		document.getElementById("UserDropdown").innerHTML = '<a id = "nameD" href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><span class="caret"></span></a><ul class="dropdown-menu" role="menu"><li><a href="#" id="view_prof">View Profile</a></li><li><a href="#" id="logout">Log Out</a></li></ul>'
		document.getElementById('nameD').appendChild(userD);
		document.getElementById("logout").onclick = function() {
			
			ajax("http://" + localStorage.ip + ":" + localStorage.port + "/logout", {}, {"user" : sessionStorage.user, "token" : sessionStorage.token}, function(result) {
				if(result.code == 0) {
					sessionStorage.removeItem('user');
					sessionStorage.removeItem('token');
					localStorage.hasLoggedIn = false;
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
			alert("Hello and have a good day, " + sessionStorage.user + "\nToken: " + sessionStorage.token + "\nLogged in for 1 session.\nIP: " + localStorage.ip);
		}
	} else {
		localStorage.hasLoggedIn = false;
	}
		$('.button').hover(function(){
			$(this).toggleClass('button_hovered')
		});
		$('.button').bind('touchstart',function(){
			$(this).addClass('button_hovered')
		});
		$('.button').bind('touchend',function(){
			$(this).removeClass('button_hovered')
		});
	
});
$(window).resize(function(){
	if($(window).width()<768){
		$('.current_page').show();
	}else{
		$('.current_page').hide();
	}
});

