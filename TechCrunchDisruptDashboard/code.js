function init() {
	var $label = x$("#current-location");
    var button = document.getElementById('button-test');
    var GMButton = new gm.widgets.Button({
		"label":"Start Demo",
		 "width":"200", 
		 "callBack":startDemo,
		 "parentElement":button
	});
    GMButton.render();
}
/*
function sendLocation(lat, lng, id)
{
	gm.comm.webServiceRequest(
	    function(responseObj) {
	    	if (!responseObj.success)
	    	{
	    		console.log('Update failed, stopping locaiton updates");
	    		gm.info.clearPosition(watchPositionID);
	    	} else {
	    		console.log('Success: webServiceRequest.  Response: ' + responseObj);
	    	}
	    },
	    function(responseObj) {
	    	console.log('Failure: webServiceRequest.  Response: ' + responseObj);
	    },
	    {
	      url: "http://tcdisrupt13.azurewebsites.net/api/sync",
	      method: "GET",
	      parameters: 
	    	  { "lat": lat,
	    	  	"lng": lng,
	    	  	"vin": myId
	    	  }
	    }
    );
};
*/
function initiateSync(lat, lng, id) {
	watchPositionID = gm.info.watchPosition(
		    function(positionObj) {
		    	var $label = x$("#current-location");
		    	var lat =  positionObj.coords.latitude * 0.000000277777778;
		    	var lng = positionObj.coords.longitude * 0.000000277777778;
		        console.log('Success: watchPosition.');
		        console.log('Timestamp: ' + positionObj.timestamp + ', Latitude: ' + lat + ', Longitude: ' + lng);
		        $label.html("lat: " + lat + ", " + "lng: " + lng);
		        //sendLocation(lat, lng, id);
		    },
		    function() {
		        console.log('Failure: watchPosition. May need to load route in emulator.');
		    },
		    {
		        maximumAge: 30000,
		        timeout: 30000,
		        frequency: 1000
		    }
		);
}

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

startDemo = function(){
    var myId = makeid();
	gm.info.getCurrentPosition(
	    function(positionObj) {
	        console.log('Success: getCurrentPosition.');
	        console.log('Timestamp: ' + positionObj.timestamp + ', Latitude: ' + positionObj.coords.latitude + ', Longitude: ' + positionObj.coords.longitude);
	        initiateSync(positionObj.coords.latitude, positionObj.coords.longitude, myId);
	    },
	    function() {
	        console.log('Failure: getCurrentPosition. May need to load route in emulator.');
	    },
	    {
	        maximumAge: 30000,
	        timeout: 30000,
	        frequency: 1000
	    }
	);
};


/*
function contact()
{
	gm.comm.webServiceRequest(
		    function(responseObj) {
		        if (responseObj.success){
			        console.log('Success: contact. Message: starting updates!');
		        	//startUpdates();
		        }
		    },
		    function(responseObj) {
		        console.log('Failure: contact.  Response: ' + responseObj);
		    },
		    {
		    url: "http://tcdisrupt13.azurewebsites.com/api/contact",
		    method: "GET",
		    parameters:
		        {
		           "vin" : gm.info.getVIN()
		        }
		    }
		);
}

*/


/*
function getContacts() {
	var $contacts = x$("contacts");
	gm.comm.webServiceRequest(
	    function(responseObj) {
	        console.log('Success: webServiceRequest.  Response: ' + responseObj);
	    },
	    function(responseObj) {
	        console.log('Failure: webServiceRequest.  Response: ' + responseObj);
	    },
	    {
	    url: "http://tcdisrupt13.azurewebsites.com/api/contacts",
	    method: "GET",
	    parameters:
	        {
	            : 99999
	        }
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
*/
