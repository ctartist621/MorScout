/*
$(document).ready(function() {
	var jsonStr = '{"1" : {"red" : [1515,1516,1517],"blue" : [1717,1718,1719],"time" : "5:00 AM", "scouted" : "Yes" }, "2" : {"red" : [1111,1112,1113],"blue" : [1212,1213,1214],"time" : "2:00 AM", "scouted" : "No" }}';
	var jsonfile ;
	$.ajax({
        type: "GET",
		url: "hebdate.json",
		dataType: "json",
		success: function(json) {
	 		jsonfile = JSON.parse(jsonStr);
		}
	});
*/
	/*
	
	THIS IS WHAT THE SAMPLE JSON FILE LOOKS LIKE
	
		{
			"1" : {
				"red" : [
					1515,
					1516,
					1517
				],
				"blue" : [
					1717,
					1718,
					1719
				],
				"time" : "2:00 AM"
			},
			"2" : {
				"red" : [
					1515,
					1516,
					1517
				],
				"blue" : [
					1717,
					1718,
					1719
				],
				"time" : "5:00 AM"
			}
	
		}

	*/
	
	//var jsonStr = '{"1" : {"red" : [1515,1516,1517],"blue" : [1717,1718,1719],"time" : "5:00 AM", "scouted" : "Yes" }, "2" : {"red" : [1111,1112,1113],"blue" : [1212,1213,1214],"time" : "2:00 AM", "scouted" : "No" }, "3" : {"red" : [1515,1516,1517],"blue" : [1717,1718,1719],"time" : "5:00 AM", "scouted" : "Yes" }, "4" : {"red" : [1111,1112,1113],"blue" : [1212,1213,1214],"time" : "2:00 AM", "scouted" : "No" }, "5" : {"red" : [1515,1516,1517],"blue" : [1717,1718,1719],"time" : "5:00 AM", "scouted" : "Yes" }, "6" : {"red" : [1111,1112,1113],"blue" : [1212,1213,1214],"time" : "2:00 AM", "scouted" : "No" }, "7" : {"red" : [1515,1516,1517],"blue" : [1717,1718,1719],"time" : "5:00 AM", "scouted" : "Yes" }, "8" : {"red" : [1111,1112,1113],"blue" : [1212,1213,1214],"time" : "2:00 AM", "scouted" : "No" }, "9" : {"red" : [1515,1516,1517],"blue" : [1717,1718,1719],"time" : "5:00 AM", "scouted" : "Yes" }, "10" : {"red" : [1111,1112,1113],"blue" : [1212,1213,1214],"time" : "2:00 AM", "scouted" : "No" }}';
	//var jsonfile = JSON.parse(jsonStr);
	
 
$(document).ready(function() {

	// !!! VERY IMPORTANT !!! OPEN IN FIREFOX! CHROME DOES NOT ALLOW LOCAL AJAX
	
	$.getJSON('js/matchesJson.json', function(jsonfile){
		
		
		
		var table = document.createElement('table');
		
		var header_row = document.createElement('tr');
		
		var th1 = document.createElement('th');
		var th2 = document.createElement('th');
		var th3 = document.createElement('th');
		var th4 = document.createElement('th');
		var th5 = document.createElement('th');
		th4.colSpan = "3";
		th5.colSpan = "3";
		
		var th_text1 = document.createTextNode("#");
		var th_text2 = document.createTextNode("Time");
		var th_text3 = document.createTextNode("Scouted");
		var th_text4 = document.createTextNode("Red Teams");
		var th_text5 = document.createTextNode("Blue Teams");
		
		th1.appendChild(th_text1);
		th2.appendChild(th_text2);
		th3.appendChild(th_text3);
		th4.appendChild(th_text4);
		th5.appendChild(th_text5);
		
		header_row.appendChild(th1);
		header_row.appendChild(th2);
		header_row.appendChild(th3);
		header_row.appendChild(th4);
		header_row.appendChild(th5);
		
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
				var td3 = document.createElement('td');
				var td4 = document.createElement('td');
				var td5 = document.createElement('td');
				var td6 = document.createElement('td');
				var td7 = document.createElement('td');
				var td8 = document.createElement('td');
				var td9 = document.createElement('td');

				var text1 = document.createTextNode(real_match_number);
				var text2 = document.createTextNode(jsonfile[real_match_number].time);
				var text3 = document.createTextNode(jsonfile[real_match_number].scouted);
				var text4 = document.createTextNode(jsonfile[real_match_number].red[0]);
				var text5 = document.createTextNode(jsonfile[real_match_number].red[1]);
				var text6 = document.createTextNode(jsonfile[real_match_number].red[2]);
				var text7 = document.createTextNode(jsonfile[real_match_number].blue[0]);
				var text8 = document.createTextNode(jsonfile[real_match_number].blue[1]);
				var text9 = document.createTextNode(jsonfile[real_match_number].blue[2]);

				td1.appendChild(text1);
				td2.appendChild(text2);
				td3.appendChild(text3);
				td4.appendChild(text4);
				td5.appendChild(text5);
				td6.appendChild(text6);
				td7.appendChild(text7);
				td8.appendChild(text8);
				td9.appendChild(text9);
				
				tr.appendChild(td1);
				tr.appendChild(td2);
				tr.appendChild(td3);
				tr.appendChild(td4);
				tr.appendChild(td5);
				tr.appendChild(td6);
				tr.appendChild(td7);
				tr.appendChild(td8);
				tr.appendChild(td9);

				table.appendChild(tr);

		}
		
		document.body.appendChild(table);
		



		// STYLES //

		table.style.color = "orange";
		table.style.width = "90%";
		table.style.margin = "1.4em auto";
		table.style.marginBottom = "2em";
		$("tr:odd").addClass("odd_row");
		$("tr:first").addClass("first_row");
		

		// });
		
		$('tr').not(".first_row").mouseenter(function(){
		    $(this).addClass('table_hover')
		});
		
		$('tr').not(".first_row").mouseleave(function(){
		    $(this).removeClass('table_hover')
		});
		
		$('tr').not(".first_row").click(function(){
		    location = "report.html?" + getQS({"match" : $(this).children(":first").text(), "time" : $(this).children(":first").next().text()});
		});

	});
	
});

