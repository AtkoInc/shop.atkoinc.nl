// ------------------------------------------------------------------------------------------
// Global parameters
// ------------------------------------------------------------------------------------------
	var oktaOrgUrl = 'https://atkoshop.oktapreview.com';
	localStorage.setItem('oktaurl', oktaOrgUrl);
	localStorage.setItem('portalurl', 'http://localhost:8000');
	localStorage.setItem('logging', true);
	

// ------------------------------------------------------------------------------------------
// generic functions
// ------------------------------------------------------------------------------------------

function writeLog(message) {
	
	if (localStorage.getItem('logging') == 'true') {
		console.log(message);
	} 
}

// ------------------------------------------------------------------------------------------
// session management
// ------------------------------------------------------------------------------------------

	function checkSession() {
		$.ajax({
			url: oktaOrgUrl + '/api/v1/users/me',
			type: 'GET',
			xhrFields: { withCredentials: true },
			accept: 'application/json'
		}).done(function (response) {
			localStorage.setItem('user', response.id)
		    writeLog('-> result function: checkSession = done with id '+ response.id);   
		    return response
		}).fail(function(response) {
		    writeLog('-> result function: checkSession = fail');   
			return  false
		})
	}