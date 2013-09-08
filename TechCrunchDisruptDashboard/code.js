var $label, $sync, $id, myLat, myLng, myId, phoneLat, phoneLng, bitches_name;
var DEGREE_MAS_RATIO = 0.000000277777778;
var bitches_phone = "19099794009";
var domain = "http://tcdisrupt13.azurewebsites.net";
//var domain = "http://localhost:3000";
function init() {
	
	/** Converts numeric degrees to radians */
	if (typeof(Number.prototype.toRad) === "undefined") {
	  Number.prototype.toRad = function() {
	    return this * Math.PI / 180;
	  }
	}
	
	x$(".contact").click(startDemo);

	$label = x$("#current-location");
	$id = x$("#car-id");
	$sync = x$("#sync-status");
	/*
    var button = document.getElementById('button-test');
    var GMButton = new gm.widgets.Button({
		"label":"Start Demo",
		 "width":"200", 
		 "callBack":startDemo,
		 "parentElement":button
	});
    GMButton.render();
    */
}

function notifyBitches(message){
	gm.comm.webServiceRequest(
		    function(responseObj) {
		    },
		    function(responseObj) {
		    },
		    {
		      url: domain + "/api/notify",
		      method: "GET",
		      parameters: 
		    	  {
		    	  	"id": myId,
		    	  	"phone" : bitches_phone,
		    	  	"message" : message
		    	  }
		    }
	    );
}

function renderContacts () {
	var contacts = x$(".contact");
	for (var i = 0; i < contacts.length; i++)
	{
		var contactDetail = contacts[i];
		var dataId = contactDetail.getAttribute('data-id');
		console.log(dataId);
	}
}
function distance(lat1, lng1, lat2, lng2)
{
	var R = 3956.6; // miles
	var dLat = (lat2-lat1).toRad();
	var dLng = (lng2-lng1).toRad(); 
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
	        Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
	        Math.sin(dLng/2) * Math.sin(dLng/2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c;
	var value2 = d;
	return value2;
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
	    		if (phoneLat && phoneLng) {
	    			var dist = distance(myLat, myLng, phoneLat, phoneLng);
	    			if (dist < 0.064)
	    			{
	    				notifyBitches("Hey " + bitches_name + " it's Route.me, I've arrived!");
	    				gm.comm.webServiceRequest(
	    					    function(responseObj) {
	    					    },
	    					    function(responseObj) {
	    					    },
	    					    {
	    					      url: domain + "/api/sync",
	    					      method: "GET",
	    					      parameters: 
	    					    	  {
	    					    	  	"id": id
	    					    	  }
	    					    }
	    				    );
	    				gm.info.clearPosition(watchPositionID);
	    			}
	    		}
	    		$sync.html("phone lat: " + phoneLat + "<br/>phone lng: " + phoneLng + "<br/>line_distance:" + dist);
	    	} else {
	    		$sync.html("FAILED");
	    		//gm.info.clearPosition(watchPositionID);
	    	}
	    },
	    function(responseObj) {
	    },
	    {
	      url: domain + "/api/sync",
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
		$sync.html("setting dest<br/>car_lat: " + phoneLat/DEGREE_MAS_RATIO + "<br/>car_lng: " + phoneLng/DEGREE_MAS_RATIO);
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
					        frequency: 1000
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

startDemo = function(e){
	bitches_name = e.currentTarget.innerText.trim();
	x$('.contact-list')[0].style.display = "none";
	x$('#debugstatus')[0].style.display = "block";	

	
	
    myId = makeid();
    $id.html(myId);
	gm.info.getCurrentPosition(
	    function(positionObj) {
	    	myLat = positionObj.coords.latitude * DEGREE_MAS_RATIO;
	    	myLng = positionObj.coords.longitude * DEGREE_MAS_RATIO;
			notifyBitches("Hey " + bitches_name + " it's Route.me, open this link so I can find you! http://tcdisrupt13.azurewebsites.net/map?id=" + myId);
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
