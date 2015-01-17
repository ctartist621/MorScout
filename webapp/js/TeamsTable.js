$(document).ready(function() {
	
	// !!! VERY IMPORTANT !!! OPEN IN FIREFOX! CHROME DOES NOT ALLOW LOCAL AJAX
	
	$.getJSON('json/officialteams.json', function(jsonfile){
		
		var table = document.createElement('table');
		
		var header_row = document.createElement('tr');
		
		var th1 = document.createElement('th');
		var th2 = document.createElement('th');
		
		var th_text1 = document.createTextNode("Team");
		var th_text2 = document.createTextNode("Name");
		
		th1.appendChild(th_text1);
		th2.appendChild(th_text2);
		
		header_row.appendChild(th1);
		header_row.appendChild(th2);
		
		table.appendChild(header_row);
		
		for (match_number = 0 ; match_number < Object.keys(jsonfile).length  ; match_number++) {
				
			var real_match_number = Object.keys(jsonfile)[match_number];
			var tr = document.createElement('tr');

			var td1 = document.createElement('td');
			var td2 = document.createElement('td');

			var text1 = document.createTextNode(jsonfile[real_match_number].team_number);
			var text2 = document.createTextNode(jsonfile[real_match_number].nickname);

			td1.appendChild(text1);
			td2.appendChild(text2);
				
			tr.appendChild(td1);
			tr.appendChild(td2);

			table.appendChild(tr);

		};
		
		document.body.appendChild(table);
		
		$('#loading').hide();
		$("tr:odd").addClass("odd_row");
		$("tr:first").addClass("first_row");
		$(table).addClass('teams_table');
		$("tr:last").attr('id', 'scrollHere');
		
		$('tr').not(".first_row").mouseenter(function(){
		    $(this).addClass('table_hover');
		});
		
		$('tr').not(".first_row").mouseleave(function(){
		    $(this).removeClass('table_hover');
		});
		
		$('tr').not(".first_row").click( function(){
			location = "reportTeam.html?" + getQS({"team" : $(this).children(":first").text(), "name" : $(this).children(":first").next().text()});
		});

	});
});