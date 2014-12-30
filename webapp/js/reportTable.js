$(document).ready(function() {
	
	// !!! VERY IMPORTANT !!! OPEN IN FIREFOX! CHROME DOES NOT ALLOW LOCAL AJAX
	
	$.getJSON('js/matchesJson.json', function(jsonfile){
	
		var r1 = document.createTextNode(jsonfile[sessionStorage.match_num].red[0]);
		var r2 = document.createTextNode(jsonfile[sessionStorage.match_num].red[1]);
		var r3 = document.createTextNode(jsonfile[sessionStorage.match_num].red[2]);
		var b1 = document.createTextNode(jsonfile[sessionStorage.match_num].blue[0]);
		var b2 = document.createTextNode(jsonfile[sessionStorage.match_num].blue[1]);
		var b3 = document.createTextNode(jsonfile[sessionStorage.match_num].blue[2]);
		
		document.getElementById('r1').appendChild(r1);
		document.getElementById('r2').appendChild(r2);
		document.getElementById('r3').appendChild(r3);
		document.getElementById('b1').appendChild(b1);
		document.getElementById('b2').appendChild(b2);
		document.getElementById('b3').appendChild(b3);
		
		
 
	});
	
});