	//var jsonStr = '{"1" : {"red" : [1515,1516,1517],"blue" : [1717,1718,1719],"time" : "5:00 AM", "scouted" : "Yes" }, "2" : {"red" : [1111,1112,1113],"blue" : [1212,1213,1214],"time" : "2:00 AM", "scouted" : "No" }, "3" : {"red" : [1515,1516,1517],"blue" : [1717,1718,1719],"time" : "5:00 AM", "scouted" : "Yes" }, "4" : {"red" : [1111,1112,1113],"blue" : [1212,1213,1214],"time" : "2:00 AM", "scouted" : "No" }, "5" : {"red" : [1515,1516,1517],"blue" : [1717,1718,1719],"time" : "5:00 AM", "scouted" : "Yes" }, "6" : {"red" : [1111,1112,1113],"blue" : [1212,1213,1214],"time" : "2:00 AM", "scouted" : "No" }, "7" : {"red" : [1515,1516,1517],"blue" : [1717,1718,1719],"time" : "5:00 AM", "scouted" : "Yes" }, "8" : {"red" : [1111,1112,1113],"blue" : [1212,1213,1214],"time" : "2:00 AM", "scouted" : "No" }, "9" : {"red" : [1515,1516,1517],"blue" : [1717,1718,1719],"time" : "5:00 AM", "scouted" : "Yes" }, "10" : {"red" : [1111,1112,1113],"blue" : [1212,1213,1214],"time" : "2:00 AM", "scouted" : "No" }}';
	//var jsonfile = JSON.parse(jsonStr);
	
function toMilitary(str){
	if(str.indexOf(":") == 1){	
		if(str.substring(5, 7) == "AM"){
			return parseInt(str.substring(0,1)+str.substring(2,4));
		}else{
			var mil = parseInt(str.substring(0,1))+12;
			return parseInt(mil.toString()+str.substring(2,4));
		}
	}else{
		if(str.substring(6, 8) == "AM"){
			if(str.substring(0,2) == "12"){
				return parseInt(str.substring(3,5));
			}else{
				return parseInt(str.substring(0,2)+str.substring(3,5));
			}
		}else{
			if(str.substring(0,2) == "12"){
				return parseInt("12" + str.substring(3,5));
			}else{
				var mil = parseInt(str.substring(0,2))+12;
				return parseInt(mil.toString()+str.substring(3,5));
			}
		}
	}
}
function getMilitary(d) {
	mins = d.getMinutes().toString();
	if(mins.length == 1){
		mins = "0" + mins;
	} else if(mins.length == 0){
		mins = "00";
	}
	return parseInt(d.getHours().toString() + mins);
}
function addMinutes(time, mins){
	if ((time+mins)%100 > 60){
		return ((Math.floor((time+mins)/100)+1)*100)+((time+mins)%((60 - (time%100)) + time))
	}else{
		return time+mins;
	}
}



$(document).ready(function() {
  if(localStorage.hasSynced == "true"){
		var jsonfile = JSON.parse(localStorage.matches);
		var table = document.createElement('table');
		
		var header_row = document.createElement('tr');
		
		var th1 = document.createElement('th');
		var th2 = document.createElement('th');
		var th3 = document.createElement('th');
		var th4 = document.createElement('th');
		var th5 = document.createElement('th');
		th4.colSpan = "3";
		th5.colSpan = "3";

		$(th4).addClass('matchesTableHide');
		$(th5).addClass('matchesTableHide');
		$(th4).addClass('redTeamHeader');
		$(th5).addClass('blueTeamHeader');
	
		var th_text1 = document.createTextNode("#");
		var th_text2 = document.createTextNode("Time");
		var th_text3 = document.createTextNode("Progress");
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
				var real_match_number_plus_one = Object.keys(jsonfile)[match_number+1];
				
				var tr = document.createElement('tr');
				 
				var td1 = document.createElement('td');
				var td2 = document.createElement('td');
				var td3 = document.createElement('td');
				var td4 = document.createElement('td');
				var td5 = document.createElement('td');
				var td6 = document.createElement('td');
				var td7 = document.createElement('td');
				var td8 = document.createElement('td');
				var td9 = document.createElement('td');

				$(td4).addClass('matchesTableHide');
				$(td5).addClass('matchesTableHide');
				$(td6).addClass('matchesTableHide');
				$(td7).addClass('matchesTableHide');
				$(td8).addClass('matchesTableHide');
				$(td9).addClass('matchesTableHide');

				if(localStorage.userTeam) {
					var allTeams = jsonfile[real_match_number].red.concat(jsonfile[real_match_number].blue);
					var tds = [td4, td5, td6, td7, td8, td9];
					for(var i = 0; i < 6; i++) {
						if(allTeams[i] == localStorage.userTeam) {
							$(tds[i]).addClass("selfTeamHighlight");
							break;
						}
						var ally = false;
						var enemy = false;
						for(var m in jsonfile) {
							if(parseInt(m) > parseInt(real_match_number)) {
								var selfRed = ~jsonfile[m].red.indexOf(localStorage.userTeam);
								var selfBlue = ~jsonfile[m].blue.indexOf(localStorage.userTeam);
								var otherRed = ~jsonfile[m].red.indexOf(allTeams[i]);
								var otherBlue = ~jsonfile[m].blue.indexOf(allTeams[i]);
								if((selfRed && otherRed) || (selfBlue && otherBlue)) {
									ally = true;
								}
								if((selfRed && otherBlue) || (selfBlue && otherRed)) {
									enemy = true;
								}
							}
						}
						if(ally && enemy) {
							$(tds[i]).addClass("frenemyTeamHighlight");
						}
						else if(ally) {
							$(tds[i]).addClass("allyTeamHighlight");
						}
						else if(enemy) {
							$(tds[i]).addClass("enemyTeamHighlight");
						}
					}
				}
				else {
					$(td4).addClass('redTeamHighlight');
					$(td5).addClass('redTeamHighlight');
					$(td6).addClass('redTeamHighlight');

					$(td7).addClass('blueTeamHighlight');
					$(td8).addClass('blueTeamHighlight');
					$(td9).addClass('blueTeamHighlight');
				}

				var text1 = document.createTextNode(real_match_number);

                var BlueAllianceTime = new Date(jsonfile[real_match_number].timestamp*1000);
                var Hours = BlueAllianceTime.getHours();
                var suffix;
                if(parseInt(Hours) > 12){
                  Hours = (parseInt(Hours) - 12).toString();
                  suffix = "PM";
                }else if(Hours == "12"){
                  suffix = "PM";
                }else{
                  suffix = "AM";
                }
                var Minutes = BlueAllianceTime.getMinutes();
                if(parseInt(Minutes) < 10){
                  Minutes = "0" + Minutes;
                }
                var text2 = document.createTextNode(Hours+":"+Minutes+" "+suffix);
	            

				var scouted = 0;
				var teams = jsonfile[real_match_number].red.concat(jsonfile[real_match_number].blue);
				for(var i = 0; i < teams.length; i++) {
					var team = JSON.parse(localStorage.data)[teams[i]];
					if(team && team[real_match_number] && Object.keys(team[real_match_number]).length > 0 && team[real_match_number][Object.keys(team[real_match_number])[0]].length > 0) {
						scouted++;
					}
				}
				var text3 = document.createTextNode(scouted == 0 ? "none" : scouted == 6 ? "complete" : scouted + " of 6");

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
				
				var currentTime = new Date().getTime();

				if(real_match_number_plus_one !== undefined){
					if(jsonfile[real_match_number].timestamp*1000 <= currentTime && currentTime < jsonfile[real_match_number_plus_one].timestamp*1000){
						$(tr).children('td:lt(3)').addClass('current_match');
					}else{
						$(tr).children('td:lt(3)').removeClass('current_match');
					}
				}else{
					if(jsonfile[real_match_number].timestamp*1000 <= currentTime && currentTime < jsonfile[real_match_number].timestamp*1000 + 1000*60*6){
						$(tr).children('td:lt(3)').addClass('current_match');
					}else{
						$(tr).children('td:lt(3)').removeClass('current_match');
					}
				}

				/*var time = new Date();
				if(real_match_number_plus_one !== undefined){
					if(toMilitary(jsonfile[real_match_number].time) <= getMilitary(time) && getMilitary(time) < toMilitary(jsonfile[real_match_number_plus_one].time)){
						$(tr).children().addClass('current_match');
					}else{
						$(tr).children().removeClass('current_match');
					}
				} else {
					if(toMilitary(jsonfile[real_match_number].time) <= getMilitary(time) && getMilitary(time) < addMinutes(toMilitary(jsonfile[real_match_number].time), 5)){
						$(tr).children().addClass('current_match');
					}
				}*/
		}
		
		document.body.appendChild(table);
		
		$('#loading').hide();
		$("tr:odd").addClass("odd_row");
		$("tr:first").addClass("first_row");
		$(table).addClass('matches_table')
		
		$('tr').not(".first_row").mouseenter(function(){
		    $(this).addClass('table_hover')
		});
		
		$('tr').not(".first_row").mouseleave(function(){
		    $(this).removeClass('table_hover')
		});

		$('tr').not(".first_row").bind('touchstart',function(){
		    $(this).addClass('table_hover')
		});
		
		$('tr').not(".first_row").bind('touchend',function(){
		    $(this).removeClass('table_hover')
		});
		
		$('tr').not(".first_row").click(function(){
			localStorage.match = $(this).children(":first").text();
			localStorage.time = $(this).children(":first").next().text();
		    location = "report.html?" + getQS({"match" : $(this).children(":first").text(), "time" : $(this).children(":first").next().text()});
		});

		if(window.innerWidth<630){
			$('.matchesTableHide').hide();
		}else{
			$('.matchesTableHide').show();
		}

		var $rows = $('.matches_table tr');
		$('#search').keyup(function() {
			$('tr').removeClass('odd_row');
		    var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
		    if(val==""){
		    	$("tr:odd").addClass("odd_row");
		    }

		    $rows.show().filter(function() {
		        var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
		        return !~text.indexOf(val);
		    }).hide();
		    $(".first_row").show();
		});

  }else{
  	$('#search').hide();
	$('#loading').html('Log in first!');
	setTimeout(function(){
		location = "login.html";
	}, 1000)
  };	

});

$(window).resize(function() {
	if(window.innerWidth<630){
		$('.matchesTableHide').hide();
	}else{
		$('.matchesTableHide').show();
	}
});

