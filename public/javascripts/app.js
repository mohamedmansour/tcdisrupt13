// Local Variables
var map, convasPhotos, firstRun, currentLocation, searchManager, photosCurrentlyOnMap, lastCarLocation, lastPhoneLocation;

function init() {
	"use strict";
	
	map = new Microsoft.Maps.Map(document.getElementById('mapFrame'), {
		credentials: TCD13.mapsKey,
		showDashboard: false,
		disableBirdseye: true,
		enableSearchLogo: false,
		showScalebar: false,
		enableClickableLogo: false
	});

	firstRun = true;

	Microsoft.Maps.Events.addHandler(map, "viewchangeend", initAfterFirstMapLoad);

	Microsoft.Maps.loadModule('Microsoft.Maps.Directions');
	Microsoft.Maps.loadModule('Microsoft.Maps.Search', function(){
		searchManager = new Microsoft.Maps.Search.SearchManager(map);
	});

	Microsoft.Maps.loadModule('Microsoft.Maps.Directions', { callback: getCarLocation }); // Starts the polling of the car location once the directions manager module is loaded

	currentLocation = TCD13.currentLocation;

	map.setView({ zoom: 11, center: new Microsoft.Maps.Location(currentLocation.ll[0], currentLocation.ll[1])});
	map.entities.clear();
	
}

function initAfterFirstMapLoad() {
	"use strict";
	
	if (firstRun) {
		firstRun = false;
		restoreStateFromUrl();

		if (!urlState.nf) {
			var styleDOM = document.createElement('style');
			styleDOM.innerHTML = '.fadeIN { opacity: 0; margin-top: 25px; font-size: 21px; text-align: center; -webkit-transition: opacity 0.5s ease-in; -moz-transition: opacity 0.5s ease-in; -o-transition: opacity 0.5s ease-in; -ms-transition: opacity 0.5s ease-in; transition: opacity 0.5s ease-in;} .loaded { opacity: 1;}';
			document.body.appendChild(styleDOM);
		}
	}
}

function appActivate() {
	"use strict";
	
	$("header").addClass("active");
	$("#welcomeScreen").fadeOut(800);
	$("#theApp").removeClass("obscured");
}

function appDeactivate() {
	"use strict";

	$("header").removeClass("active");
	$("#welcomeScreen").fadeIn(800);
	$("#theApp").addClass("obscured");
}

var directionsManager;
var pins = {A:null, B:null, C:null};

function createDrivingRoute(carLocation, phoneLocation, autoUpdateMapView) {
	"use strict";

	var waypoint, pinA, pinB, pinC;
	
	if (autoUpdateMapView === undefined) autoUpdateMapView = true;

	pinA = { 
		lat:(carLocation.startLat || carLocation.lat || phoneLocation.lat),
		lng:(carLocation.startLng || carLocation.lng || phoneLocation.lng)
	}
	
	pinB = { 
		lat:(carLocation.lat || carLocation.startLat || phoneLocation.lat),
		lng:(carLocation.lng || carLocation.startLng || phoneLocation.lng)
	}
	
	pinC = { 
		lat:(phoneLocation.lat || carLocation.lat || carLocation.startLat),
		lng:(phoneLocation.lng || carLocation.lng || carLocation.startLng)
	}
	
	directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);
	
	if (!directionsManager || true) {
		//directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);
	
		
		Microsoft.Maps.Events.addHandler(directionsManager, 'directionsUpdated', function(event) {console.log('Directions updated'); displayRouteNumber(event); });

		directionsManager.setRequestOptions({routeMode: Microsoft.Maps.Directions.RouteMode.driving, autoUpdateMapView: autoUpdateMapView });

		
		pins.A = new Microsoft.Maps.Directions.Waypoint({location: new Microsoft.Maps.Location(pinA.lat, pinA.lng)});
		directionsManager.addWaypoint(pins.A);
	
		pins.B = new Microsoft.Maps.Directions.Waypoint({location: new Microsoft.Maps.Location(pinB.lat, pinB.lng), isViapoint:true});
		directionsManager.addWaypoint(pins.B);
	
		pins.C = new Microsoft.Maps.Directions.Waypoint({location: new Microsoft.Maps.Location(pinC.lat, pinC.lng)});
		directionsManager.addWaypoint(pins.C);
	
		// Specify a handler for when the directions are calculated
		//Microsoft.Maps.Events.addHandler(directionsManager, 'directionsUpdated', displayRouteNumber);
	}
	
	//directionsManager.resetDirections();
	pins.A.setOptions({ location: new Microsoft.Maps.Location(pinA.lat, pinA.lng) });
	pins.B.setOptions({ location: new Microsoft.Maps.Location(pinB.lat, pinB.lng) });
	pins.C.setOptions({ location: new Microsoft.Maps.Location(pinC.lat, pinC.lng) });

	directionsManager.calculateDirections();
}

function displayRouteNumber(event) {
	"use strict";
	
	var totalTime, remainingTime;
	
	if (event && event.route && event.route[0] && event.route[0].routeLegs && event.route[0].routeLegs[0] && event.route[0].routeLegs[0].summary && event.route[0].routeLegs[0].summary.timeWithTraffic) {
		if (event && event.route && event.route[0] && event.route[0].routeLegs && event.route[0].routeLegs[1] && event.route[0].routeLegs[1].summary && event.route[0].routeLegs[1].summary.timeWithTraffic) {
			remainingTime = event.route[0].routeLegs[1].summary.timeWithTraffic;
			totalTime = event.route[0].routeLegs[0].summary.timeWithTraffic + remainingTime;
			
			console.log("Time remaining: " + remainingTime);
			
			$("#headerBar")[0].innerText = Math.round(remainingTime/60) + "min " + Math.round(remainingTime)%60 + "sec remaining"; appDeactivate();
			console.log("Percent done: " + Math.round((1-remainingTime/totalTime)*1000)/10 + "%");
		}
	}
}

function fetchLocationAndLaunchQuery(carLocation, phoneLocation, redrawMap){
	"use strict";
	
	var tasks={};

	if (!phoneLocation) { phoneLocation = {name:"Phone User", /*locationString:"SFO",*/ lat:null, lng: null}; }
	if (!carLocation) { carLocation = {name:"Car Location", locationString:"SJC", lat:null, lng: null}; }
	
	if (!carLocation.lat && carLocation.locationString) {
		tasks.carLocation = function(outerCallback) {
			var callback = function(lat,lng) {
				carLocation.lat = lat;
				carLocation.lng = lng;
				lastCarLocation = carLocation;
				delete tasks.carLocation;
				outerCallback();
			}
			
			geoCode(carLocation.locationString, callback);
		}
	}
	
	if (!phoneLocation.lat && phoneLocation.locationString) {
		tasks.phoneLocation = function(outerCallback) {
			var callback = function(lat,lng) {
				phoneLocation.lat = lat;
				phoneLocation.lng = lng;
				if (JSON.stringify(lastPhoneLocation) !== JSON.stringify(phoneLocation)) {
					lastPhoneLocation = phoneLocation;
					redrawMap = true;
				}
				delete tasks.phoneLocation;
				outerCallback();
			}
			
			geoCode(phoneLocation.locationString, callback);
		}

	}
	else if (!phoneLocation.lat) {
		tasks.phoneLocation = function(outerCallback) { // new name space
			var html5Geolocation;
			
			html5Geolocation = navigator.geolocation;
			
			var callbackSuccess = function(position) {
				phoneLocation.lat = position.coords.latitude;
				phoneLocation.lng = position.coords.longitude;
				phoneLocation.accuracy = position.coords.accuracy; // meters
				
				if (JSON.stringify(lastPhoneLocation) !== JSON.stringify(phoneLocation)) {
					lastPhoneLocation = phoneLocation;
					redrawMap = true;
				}
				
				delete tasks.phoneLocation;
				
				outerCallback();
			}
			
			var callbackError = function(err) {
				console.error("Failed to geolocate phone w/ html5 geolocation: " + err.message);
				delete tasks.phoneLocation;
				
				checkIfDoneGeolocating();
			}
			
			if (html5Geolocation) {
				html5Geolocation.getCurrentPosition(callbackSuccess, callbackError);
			} 
			else {
				console.error("Geolocation services are not supported by your web browser.");
			}
		};
		
		var carAndPhoneAreGeolocatedCallback = function() {
			if (redrawMap) {
				//map.setView({ bounds: Microsoft.Maps.LocationRect.fromLocations (new Microsoft.Maps.Location(toLat, toLng), new Microsoft.Maps.Location(fromLat, fromLng))});		

				map.entities.clear(); 
				createDrivingRoute(carLocation, phoneLocation);
						
				//urlState.from = from;
				//urlState.q = to;
				urlState.wp = [carLocation.lat, carLocation.lng, phoneLocation.lat, phoneLocation.lng];

				_gaq.push(['_trackEvent', 'Map', 'DirectionSearch', getUrl()]);
			}
		}
	}
	
	var checkIfDoneGeolocating = function() {
		if (Object.keys(tasks).length === 0) {
			carAndPhoneAreGeolocatedCallback();
		}
	}
	
	Object.keys(tasks).forEach(function(taskKey) {
		tasks[taskKey](checkIfDoneGeolocating); // Run task
	});
	
	checkIfDoneGeolocating();

	appActivate();
}

function geoCode(locationString, callback) {
	"use strict";
	
	var searchManager = searchManager || new Microsoft.Maps.Search.SearchManager(map);
	
	var geocodeRequest = {where:locationString, count:1, callback:function(geocodeResult) {
			var geoCodeResultTo = geocodeResult.results[0].location;
			callback(geoCodeResultTo.latitude, geoCodeResultTo.longitude);
		}
	};
	
	searchManager.geocode(geocodeRequest);
}

var getCarLocationTimer;


function getCarLocation() {
	"use strict";
	
	var redrawMap = false, jsonUrl = "/api/get?id=" + (urlState.id || "abc123");
	
	if (lastPhoneLocation && lastPhoneLocation.lat !== undefined && lastPhoneLocation.lng !== undefined) {
		jsonUrl += ("&lat=" + lastPhoneLocation.lat + "&lng=" + lastPhoneLocation.lng);
	}
	
	$.ajax({
		type: "get", url: jsonUrl,
		success: function (data, text) {
			var carLocation
			if (data && data.status) {
				carLocation = {name:"Car Location", locationString:null, lat:data.lat, lng:data.lng, startLat:data.startLat, startLng:data.startLng};
				if (JSON.stringify(lastCarLocation) !== JSON.stringify(carLocation)) {
					lastCarLocation = carLocation;
					console.log("Car has moved from: " + JSON.stringify(lastCarLocation) + " to " + JSON.stringify(carLocation));
					redrawMap = true;
				}
				
				fetchLocationAndLaunchQuery(carLocation, null, redrawMap);
			}
		},
		error: function (request, status, error) {
			console.error("Error getting [" + jsonUrl + "] : " + error);
		}
	});
	
	if (!getCarLocationTimer) {
		getCarLocationTimer = setInterval(getCarLocation, 3000);
	}
}

init();
