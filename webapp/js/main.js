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

$(document).ready(function() {
	document.getElementById('nameD').innerHTML = localStorage.user;	
});

