function init() {
	sendLocationToServer();
}

function getAPI() {
	gm.comm.webServiceRequest(
	    function(responseObj) {
	        console.log('Success: webServiceRequest.  Response: ' + responseObj);
	    },
	    function(responseObj) {
	        console.log('Failure: webServiceRequest.  Response: ' + responseObj);
	    },
	    {
	      url: "http://tcdisrupt13.azurewebsites.net/api",
	      method: "GET"
	    }
	);
}

function sendLocationToServer() {
    var $label = x$("#response");
	gm.info.getCurrentPosition(
		    function(positionObj) {
		    	console.log('Success: getCurrentPosition.');
		    	console.log('Timestamp: ' + positionObj.timestamp + ', Latitude: ' + positionObj.coords.latitude + ', Longitude: ' + positionObj.coords.longitude);
		        gm.comm.webServiceRequest(
		        	    function(responseObj) {
		        	    	console.log('Success: webServiceRequest.  Response: ' + responseObj);
		        	        $label.html(JSON.stringify(responseObj));
		        	    },
		        	    function(responseObj) {
		        	    	console.log('Failure: webServiceRequest.  Response: ' + responseObj);
		        	    },
		        	    {
		        	      url: "http://tcdisrupt13.azurewebsites.net/api",
		        	      method: "GET",
		        	      parameters: 
		        	    	  { "lat": parseFloat(positionObj.coords.latitude) * 0.000000277777778,
		        	    	  	"lng": parseFloat(positionObj.coords.longitude) * 0.000000277777778
		        	    	  }
		        	    }
		        	);
		    },
		    function() {
		    	console.log('Failure: getCurrentPosition. May need to load route in emulator.');
		    },
		    {
		        maximumAge: 30000,
		        timeout: 30000,
		        frequency: 60000
		    }
		);
}

function onDoneCallBack(data) {
	  console.log('onDone called with -> ' + data.value);
}

function onCancelCallBack() {
	console.log('Canceled!');
}

function showKeyboardEmail() {
	var keyboard = new gm.widgets.Keyboard({sender: null, language: "en-US", kbType: 1, feedbackMode: 0, Theme:'gmc', placeholder:'Placeholder', onDone: onDoneCallBack, onCancel:onCancelCallBack});
}
