var map = new Microsoft.Maps.Map(document.getElementById('mapFrame'), {
	credentials: TCD13.mapsKey,
	showDashboard: false,
	disableBirdseye: true,
	enableSearchLogo: false,
	showScalebar: false,
	enableClickableLogo: false
});

var canvasPhotos = {},
	photosCurrentlyOnMap = {},
	searchManager;

var firstRun = true;

Microsoft.Maps.Events.addHandler(map, "viewchangeend", initAfterFirstMapLoad);

Microsoft.Maps.loadModule('Microsoft.Maps.Directions');
Microsoft.Maps.loadModule('Microsoft.Maps.Search', function(){
	searchManager = new Microsoft.Maps.Search.SearchManager(map);
});

var currentLocation = TCD13.currentLocation;

map.setView({ zoom: 11, center: new Microsoft.Maps.Location(currentLocation.ll[0], currentLocation.ll[1])});
map.entities.clear();

function initAfterFirstMapLoad() {
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
	$("#theApp").removeClass("obscured");
}

function appDeactivate() {
	"use strict";

	$("#theApp").addClass("obscured");
}

var photoSetRequested = 0;
var photoSetOnDisplay = 0;


var boundingBoxesCache = {};



function createDrivingRoute(fromLat, toLat, fromLong, toLong, autoUpdateMapView) {


	if (autoUpdateMapView === undefined) autoUpdateMapView = true;

	var directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);
	
	Microsoft.Maps.Events.addHandler(directionsManager, 'directionsUpdated', function() {console.log('Directions updated') });

	directionsManager.resetDirections();
	directionsManager.setRequestOptions({routeMode: Microsoft.Maps.Directions.RouteMode.driving, autoUpdateMapView: autoUpdateMapView });

	var start = new Microsoft.Maps.Directions.Waypoint({
			location: new Microsoft.Maps.Location(fromLat, fromLong)
		}),
		stop = new Microsoft.Maps.Directions.Waypoint({
			location: new Microsoft.Maps.Location(toLat, toLong)
		});

	directionsManager.addWaypoint(start);
	directionsManager.addWaypoint(stop);

	directionsManager.calculateDirections();
}


function fetchLocationAndLaunchQuery(){
	var searchManager = searchManager || new Microsoft.Maps.Search.SearchManager(map),
		fromLat, toLat, fromLong, toLong;

	var to = "SJC", from = "SFO";

	if(isOpened){
		$("#bigPictureHolder").removeClass("active");
		$("#mapFrame").removeClass("sidebar");
	}

	map.entities.clear(); 

	if (to.length && from.length){

		var geocodeRequestFrom = {where:from, count:1, callback:function(geocodeResult){

			var geoCodeResultFrom = geocodeResult.results[0].location;
			fromLat = geoCodeResultFrom.latitude;
			fromLong = geoCodeResultFrom.longitude;

			geocodeRequestTo = {where:to, count:1, callback:function(geocodeResult){
				var geoCodeResultTo = geocodeResult.results[0].location;
				toLat = geoCodeResultTo.latitude
				toLong = geoCodeResultTo.longitude
				
				map.setView({ bounds: Microsoft.Maps.LocationRect.fromLocations (new Microsoft.Maps.Location(toLat, toLong), new Microsoft.Maps.Location(fromLat, fromLong))});		
				createDrivingRoute(fromLat, toLat, fromLong, toLong);
						
				urlState.from = from;
				urlState.q = to;
				urlState.wp = [fromLat, fromLong, toLat, toLong];

				_gaq.push(['_trackEvent', 'Map', 'DirectionSearch', getUrl()]);
			}};
			
			searchManager.geocode(geocodeRequestTo);
		}};

		searchManager.geocode(geocodeRequestFrom);
	}

	appActivate();
}

