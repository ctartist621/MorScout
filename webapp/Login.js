function validateForm() {
    var x = document.forms["login_form"]["username"].value;
    if (x == null || x == "") {
		alert("Username can not be empty");
		console.log("x is blank");
      	return false;
	}
	console.log("x is not blank");
	var y = document.forms["login_form"]["password"].value;
    if (y == null || y == "") {
      	alert("Password can not be empty");
		console.log("y is blank");
      	return false;
	}
	console.log("y is not blank");
	return true;
}