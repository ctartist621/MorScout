function validateForm() {
    		var x = document.forms["myForm"]["user"].value;
    		if (x == null || x == "") {
      			alert("username must contain something");
			console.log("x is blank");
      	 		return false;
		}
		console.log("x is not blank");
		var y = document.forms["myForm"]["pass"].value;
    		if (y == null || y == "") {
      			alert("Password must contain something");
			console.log("y is blank");
      	 		return false;
		}
		console.log("y is not blank");
		return true;
    	}