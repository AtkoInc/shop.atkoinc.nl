// ------------------------------------------------------------------------------------------
// generic functions
// ------------------------------------------------------------------------------------------

function writeLog(message) {
	
	if (localStorage.getItem('logging') == 'true') {
		console.log(message);
	} 
}

function getParameterByName( name ) //courtesy Artem
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}

// ------------------------------------------------------------------------------------------
// session management
// ------------------------------------------------------------------------------------------

	function getAuthorisationCode(codeChallenge) {
		var codeUrl = localStorage.getItem('oktaurl') + '/oauth2/'+ localStorage.getItem('authorizationserver') +'/v1/authorize?client_id='+ localStorage.getItem('clientid')  +'&response_type=code&scope=openid&redirect_uri='+localStorage.getItem('portalurl')+'/callback&state=x&nonce=y&code_challenge_method=S256&code_challenge='+ codeChallenge
		window.location = codeUrl
	}

	function checkSession() {
		$.ajax({
			url: localStorage.getItem('oktaurl') + '/api/v1/users/me',
			type: 'GET',
			xhrFields: { withCredentials: true },
			accept: 'application/json'
		}).done(function (response) {
			localStorage.setItem('user', response.id)
		    writeLog('-> result function: checkSession = done with id '+ response.id);   
		    writeLog(response)
		    return response
		}).fail(function(response) {
		    writeLog('-> result function: checkSession = fail');   
			return  false
		})
	}