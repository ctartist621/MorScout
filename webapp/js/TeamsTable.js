$(document).ready(function() {
	
	// !!! VERY IMPORTANT !!! OPEN IN FIREFOX! CHROME DOES NOT ALLOW LOCAL AJAX
	
	$.getJSON('js/teamsJson.json', function(jsonfile){
		
		
		
		var table = document.createElement('table');
		
		var header_row = document.createElement('tr');
		
		var th1 = document.createElement('th');
		var th2 = document.createElement('th');
		
		var th_text1 = document.createTextNode("#");
		var th_text2 = document.createTextNode("Team");
		
		th1.appendChild(th_text1);
		th2.appendChild(th_text2);
		
		header_row.appendChild(th1);
		header_row.appendChild(th2);
		
		table.appendChild(header_row);
		
		for (match_number = 0 ; match_number < Object.keys(jsonfile).length  ; match_number++) {
				
				var real_match_number = Object.keys(jsonfile)[match_number];
				var tr = document.createElement('tr');
				  /*	
					if(match_number time is equal to current time){
						tr.className = tr.className + "current_match";
					}
				  */
				var td1 = document.createElement('td');
				var td2 = document.createElement('td');

				var text1 = document.createTextNode(real_match_number);
				var text2 = document.createTextNode(jsonfile[real_match_number].team);

				td1.appendChild(text1);
				td2.appendChild(text2);
				
				tr.appendChild(td1);
				tr.appendChild(td2);

				table.appendChild(tr);

		}
		
		document.body.appendChild(table);



		// STYLES //

		table.style.color = "orange";
		table.style.width = "30%";
		table.style.margin = "1.4em auto";
		table.style.marginBottom = "2em";
		$("tr:odd").addClass("odd_row");

		// });

	});
	
});