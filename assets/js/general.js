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

function getParameterFromString( urlString, name ) //courtesy Artem
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( urlString );
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

function processMessage(message) {
    if (message) {
    // Display message
		writeLog('-> a message was found: '+ message);
		$("#lbl_message").text(message);
	} else {
		$("#lbl_message").text('');
    }
}

// ------------------------------------------------------------------------------------------
// session management
// ------------------------------------------------------------------------------------------

	function getAuthorisationCode(codeChallenge) {
		var codeUrl = localStorage.getItem('oktaurl') + '/oauth2/'+ localStorage.getItem('authorizationserver') +'/v1/authorize?client_id='+ localStorage.getItem('clientid')  +'&response_type=code&scope='+ localStorage.getItem('scopes') +'&redirect_uri='+localStorage.getItem('portalcallbackurl')+'&state=x&nonce=y&code_challenge_method=S256&code_challenge='+ codeChallenge
		alert('-> getting an authorisation here: '+ codeUrl);
		window.location = codeUrl
	}

	function getTokensWithCode(authorisationCode) {
		alert('-> getting tokens with the code ('+ authorisationCode +')')
		if (authorisationCode) {
			var settings = {
			  'url': localStorage.getItem('oktaurl') + '/oauth2/default/v1/token',
			  'method': 'POST',
			  'timeout': 0,
			  'headers': {
			    'Accept': 'application/json',
			    'Content-Type': 'application/x-www-form-urlencoded'
			  },
			  'data': {
			    'client_id': localStorage.getItem('clientid'),
			    'grant_type': 'authorization_code',
			    'redirect_uri': localStorage.getItem('portalcallbackurl'),
			    'code_verifier': localStorage.getItem('codeverifier'),
			    'code': authorisationCode
			  }
			};
			$.ajax(settings)
			.done(function (response) {
			  alert(response);
			  if (response.access_token) {
			  	alert('-> code returned an access token');
			  	localStorage.setItem('access_token', response.access_token);
			  	writeLog(parseJwt(response.access_token));
			  	alert(response.access_token);
			  } else {
			  	alert('some error occurred on the access token');
			  }
			  if (response.id_token) {
			  	alert('-> code returned an ID token');
			  	localStorage.setItem('id_token', response.id_token);
			  	writeLog(parseJwt(response.id_token));
			  	window.location = localStorage.getItem('portalurl') + '?message=login successful'
			  } else {
			  	alert('some error occurred on the id token');
			  	window.location = localStorage.getItem('portalurl') + '?message=login failed'
			  }


			})
			.fail(function (response) {
				window.location = '../index.html?message=Okta returned an error while exchanging the code for a token, please try again'
			});

		} else {
			alert('-> no code was found');
		}

	}

	function validateToken(tokenType) {
		var raw_idToken = localStorage.getItem(tokenType);
		var expValidity = false

		if (raw_idToken) {
			var jwt_idToken = parseJwt(raw_idToken)
			// validate exp
			var currentTimeStamp = Date.now() / 1000
			var expValidity = jwt_idToken.exp > currentTimeStamp
			writeLog('-> the token validity is ' + expValidity +' (for user: '+ jwt_idToken.name +')')
			// store data in localStorage
			var jwt_id_name = jwt_idToken.name;
			writeLog(jwt_idToken);
			localStorage.setItem('jwt_id_name', jwt_id_name);

		} else {
			expValidity = false
		}
		return expValidity;
	}

	function trashToken(tokenType) {
		localStorage.removeItem(tokenType);
	}