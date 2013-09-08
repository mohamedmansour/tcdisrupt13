var $label, $sync, $id, myLat, myLng, myId, phoneLat, phoneLng;
var DEGREE_MAS_RATIO = 0.000000277777778;
function init() {
	$label = x$("#current-location");
	$id = x$("#car-id");
	$sync = x$("#sync-status");
    var button = document.getElementById('button-test');
    var GMButton = new gm.widgets.Button({
		"label":"Start Demo",
		 "width":"200", 
		 "callBack":startDemo,
		 "parentElement":button
	});
    GMButton.render();
}

function sendLocation(lat, lng, id)
{
	gm.comm.webServiceRequest(
	    function(responseObj) {
	    	var obj = JSON.parse(responseObj);
	    	if (obj.status)
	    	{
	    		phoneLat = obj.phoneLat;
	    		phoneLng = obj.phoneLng;
	    		$sync.html("polling.. phone lat: " + phoneLat + "phone lng: " + phoneLng);
	    	} else {
	    		$sync.html("FAILED");
	    		//gm.info.clearPosition(watchPositionID);
	    	}
	    },
	    function(responseObj) {
	    },
	    {
	      url: "http://tcdisrupt13.azurewebsites.net/api/sync",
	      method: "GET",
	      parameters: 
	    	  { "lat": lat,
	    	  	"lng": lng,
	    	  	"id": id
	    	  }
	    }
    );
}

function initiateSync(lat, lng, id) {
	
	if (phoneLat && phoneLng) {
		//debugger;
		$sync.html("setting dest lat: " + phoneLat/DEGREE_MAS_RATIO + " lng: " + phoneLng/DEGREE_MAS_RATIO);
		gm.navigation.setDestination(
			function(responseObj) {
			    console.log('Success: setDestination.');
			    watchPositionID = gm.info.watchPosition(
					    function(positionObj) {
					    	myLat =  positionObj.coords.latitude * DEGREE_MAS_RATIO;
					    	myLng = positionObj.coords.longitude * DEGREE_MAS_RATIO;
					        $label.html("lat: " + myLat + ", " + "lng: " + myLng);
					        sendLocation(myLat, myLng, myId);
					    },
					    function() {
					    },
					    {
					        maximumAge: 30000,
					        timeout: 30000,
					        frequency: 3000
					    }
				);
			},
			function() {
			    console.log('Failure: setDestination.');
			},
			{
				"latitude" : "" + phoneLat/DEGREE_MAS_RATIO,
				"longitude" : "" + phoneLng/DEGREE_MAS_RATIO
			}
		);
	}
}

function makeid()
{
    var text = "abc123";
    /*
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 10; i++ )
    {    
    	text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    */

    return text;
}

function pollForPhoneLoc()
{
	var pollIntervalId = 
		setInterval(function(){
			sendLocation(myLat, myLng, myId);
			if (phoneLat && phoneLng)
			{
				clearInterval(pollIntervalId);
		        initiateSync(myLat, myLng, myId);
			}
		},
		1000);
}

startDemo = function(){
    myId = makeid();
    $id.html(myId);
	gm.info.getCurrentPosition(
	    function(positionObj) {
	    	myLat = positionObj.coords.latitude;
	    	myLng = positionObj.coords.longitude;
			$sync.html('got current position');
			pollForPhoneLoc();
	    },
	    function() {
	    },
	    {
	        maximumAge: 30000,
	        timeout: 30000,
	        frequency: 3000
	    }
	);
};
