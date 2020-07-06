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

function parseJwt(token) {
    if (token) {
	    var base64Url = token.split('.')[1];
	    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
	        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
	    }).join(''));
	    return JSON.parse(jsonPayload);
    } else {
    	return false;
    }

    
};

// ------------------------------------------------------------------------------------------
// session management
// ------------------------------------------------------------------------------------------

	function getAuthorisationCode(codeChallenge) {
		var codeUrl = localStorage.getItem('oktaurl') + '/oauth2/'+ localStorage.getItem('authorizationserver') +'/v1/authorize?client_id='+ localStorage.getItem('clientid')  +'&response_type=code&scope='+ localStorage.getItem('scopes') +'&redirect_uri='+localStorage.getItem('portalurl')+'/callback&state=x&nonce=y&code_challenge_method=S256&code_challenge='+ codeChallenge
		window.location = codeUrl
	}

	function validateToken(tokenType) {
		var raw_idToken = localStorage.getItem(tokenType);
		var expValidity = false

		if (raw_idToken) {
			var jwt_idToken = parseJwt(raw_idToken)
			// validate exp
			var currentTimeStamp = Date.now() / 1000
			var expValidity = jwt_idToken.exp > currentTimeStamp
			
			writeLog('now: '+currentTimeStamp);
			writeLog('jwt expires: '+jwt_idToken.exp);

			writeLog('-> token validity = ' + expValidity +' (for user: '+ jwt_idToken.name +')')
			// store data in localStorage
			var jwt_id_name = jwt_idToken.name;
			writeLog(jwt_idToken);
			localStorage.setItem('jwt_id_name', jwt_id_name);

		} else {
			writeLog('some shit went down');
		}
		return expValidity;
	}

	function trashToken(tokenType) {
		localStorage.removeItem(tokenType);
	}