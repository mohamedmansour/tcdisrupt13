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

	currentLocation = TCD13.currentLocation;

	map.setView({ zoom: 11, center: new Microsoft.Maps.Location(currentLocation.ll[0], currentLocation.ll[1])});
	map.entities.clear();
	
	getCarLocation();
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
	
	$("#theApp").removeClass("obscured");
}

function appDeactivate() {
	"use strict";

	$("#theApp").addClass("obscured");
}

var photoSetRequested = 0;
var photoSetOnDisplay = 0;


var boundingBoxesCache = {};



function createDrivingRoute(carLocation, phoneLocation, autoUpdateMapView) {
	"use strict";

	var waypoint;
	
	if (autoUpdateMapView === undefined) autoUpdateMapView = true;

	var directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);
	
	Microsoft.Maps.Events.addHandler(directionsManager, 'directionsUpdated', function() {console.log('Directions updated') });

	directionsManager.resetDirections();
	directionsManager.setRequestOptions({routeMode: Microsoft.Maps.Directions.RouteMode.driving, autoUpdateMapView: autoUpdateMapView });

	if (carLocation.startLat !== undefined && (carLocation.startLat !== carLocation.lat || carLocation.startLng !== carLocation.lng)) {
		waypoint = new Microsoft.Maps.Directions.Waypoint({location: new Microsoft.Maps.Location(carLocation.startLat, carLocation.startLng)});
		directionsManager.addWaypoint(waypoint);
	}

	
	if (carLocation.lat !== undefined) {
		waypoint = new Microsoft.Maps.Directions.Waypoint({location: new Microsoft.Maps.Location(carLocation.lat, carLocation.lng)});
		directionsManager.addWaypoint(waypoint);
	}

	
	if (phoneLocation.lat !== undefined) {
		waypoint = new Microsoft.Maps.Directions.Waypoint({location: new Microsoft.Maps.Location(phoneLocation.lat, phoneLocation.lng)});
		directionsManager.addWaypoint(waypoint);
	}

	// Specify a handler for when the directions are calculated
	Microsoft.Maps.Events.addHandler(directionsManager, 'directionsUpdated', displayRouteNumber);


	directionsManager.calculateDirections();
}

function displayRouteNumber(event) {
	"use strict";
	
	console.log("Number of transit routes available: " + event.route.length);
}

function fetchLocationAndLaunchQuery(carLocation, phoneLocation, redrawMap){
	"use strict";
	
	var tasks={};

	if (!phoneLocation) { phoneLocation = {name:"Phone User", /*locationString:"SFO",*/ lat:null, lng: null}; }
	if (!carLocation) { carLocation = {name:"Car Location", locationString:"SJC", lat:null, lng: null}; }
	
	if (!carLocation.lat && carLocation.locationString) {
		console.log("Getting: car location from car location string");
		tasks.carLocation = function(outerCallback) {
			var callback = function(lat,lng) {
				console.log("Got: car location from car location string");
				carLocation.lat = lat;
				carLocation.lng = lng;
				lastCarLocation = carLocation;
				console.log("Car location: " + JSON.stringify(carLocation));
				delete tasks.carLocation;
				outerCallback();
			}
			
			geoCode(carLocation.locationString, callback);
		}
	}
	
	if (!phoneLocation.lat && phoneLocation.locationString) {
		console.log("Getting: phone location from phone location string");
		tasks.phoneLocation = function(outerCallback) {
			var callback = function(lat,lng) {
				console.log("Got: phone location from phone location string");
				phoneLocation.lat = lat;
				phoneLocation.lng = lng;
				if (JSON.stringify(lastPhoneLocation) !== JSON.stringify(phoneLocation)) {
					lastPhoneLocation = phoneLocation;
					redrawMap = true;
				}
				console.log("Phone location: " + JSON.stringify(phoneLocation));
				delete tasks.phoneLocation;
				outerCallback();
			}
			
			geoCode(phoneLocation.locationString, callback);
		}

	}
	else if (!phoneLocation.lat) {
		console.log("Getting: phone location from HTML5 geolocation API");
		
		tasks.phoneLocation = function(outerCallback) { // new name space
			var html5Geolocation;
			
			html5Geolocation = navigator.geolocation;
			
			var callbackSuccess = function(position) {
				console.log("Got: phone location from HTML5 geolocation API");
				phoneLocation.lat = position.coords.latitude;
				phoneLocation.lng = position.coords.longitude;
				phoneLocation.accuracy = position.coords.accuracy; // meters
				
				if (JSON.stringify(lastPhoneLocation) !== JSON.stringify(phoneLocation)) {
					lastPhoneLocation = phoneLocation;
					redrawMap = true;
				}
				
				console.log("Phone location: " + JSON.stringify(phoneLocation));
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
					redrawMap = true;
				}
				
				fetchLocationAndLaunchQuery(carLocation, null, false);
			}
		},
		error: function (request, status, error) {
			console.error("Error getting [" + jsonUrl + "] : " + error);
		}
	});
	
	if (!getCarLocationTimer) {
		getCarLocationTimer = setInterval(getCarLocation, 1000);
	}
}

init();
