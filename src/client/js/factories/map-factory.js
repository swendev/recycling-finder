app.factory("mapFactory", ["$http", "geoApiFactory", function($http, geoApiFactory) {
	var map;
	var locationAutocomplete;
	var markers = [];
	var myLocation;
	var directionsDisplay;
	var directionsService;

	function setupMap(mapCanvas, mapOptions) {
		map = new google.maps.Map(mapCanvas, mapOptions);
	}

	function setupAutocomplete(locationSearch, searchOptions) {
		locationAutocomplete = new google.maps.places.Autocomplete(locationSearch, searchOptions);
		return locationAutocomplete;
	}

	function getSearchDistances() {
		return [
			{text: "500m",  value: 500},
			{text: "1km",   value: 1000},
			{text: "2,5km", value: 2500},
			{text: "5km",   value: 5000}
		];
	}
	function getSearchTypes() {
		return [
			{text: "Alle",          value: "all",       isChecked: false},
			{text: "Papier",        value: "paper",     isChecked: false},
			{text: "Glas",          value: "glass",     isChecked: false},
			{text: "Grüner Punkt",  value: "plastic",   isChecked: false},
			{text: "Kleidung",      value: "cloth",     isChecked: false}
		];
	}

	function addMarkerFromMyLocation(newLocation) {
		myLocation = newLocation;
		console.log(myLocation.name);
		var marker = new google.maps.Marker({
			map: map,
			title: myLocation.name,
			position: { lat: myLocation.lat, lng: myLocation.lng }
		});
		markers.push(marker);
		map.setZoom(15);
		map.panTo(marker.position);
	}

	function createMarker(location) {
		// location types and sort them
		var types = location.type;
		types.sort();
		// get icon name from types
		var icon = "";
		angular.forEach(types, function(type, key) {
			if(key === 0) {
				icon = type;
			} else {
				icon += "_" + type;
			}
		});
		console.log(location);
		var marker = new google.maps.Marker({
			map: map,
			title: location.name,
			position: {lat: location.loc.coordinates[1], lng: location.loc.coordinates[0]},
			icon: new google.maps.MarkerImage("img/svg/" + icon + ".svg",	null, null, null, new google.maps.Size(36,36)),
			animation: google.maps.Animation.DROP
		});
		/* don't need event listeners for now
		google.maps.event.addListener(newMarker, 'click', function() {
			console.log("I'm a click listener");
		}); */
		return marker;
	}

	function addMarkersFromLocations(locations) {
		removeRoute();
		console.log(locations);
		angular.forEach(locations, function(location, key) {
			console.log(location);
			setTimeout(function() {
				var marker = createMarker(location);

				markers.push(marker);
			}, key * 200);
		});
		return locations.length;
	}

	function removeMarkers() {
		angular.forEach(markers, function(marker, key) {
			marker.setMap(null);
		});
	}
	function createRoute(location) {
		removeRoute();

		// set destination
		var origin = new google.maps.LatLng(myLocation.lat,myLocation.lng);
		var destination = new google.maps.LatLng(location.loc.coordinates[1],location.loc.coordinates[0]);

		directionsService = new google.maps.DirectionsService();
		var rendererOptions = {
			map: map,
			suppressMarkers: true
		};
		directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);

		var request = {
			origin: origin,
			destination: destination,
			travelMode: google.maps.TravelMode.WALKING,
			unitSystem: google.maps.UnitSystem.METRIC
		};

		directionsService.route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				console.log(response.routes[0].warnings);
				directionsDisplay.setDirections(response);
				console.log(response);
			}
		});
	}

	function removeRoute() {
		// remove existing route
		if (directionsDisplay !== undefined) {
			directionsDisplay.setMap(null);
		}
	}

	return {
		setupMap: setupMap,
		setupAutocomplete: setupAutocomplete,
		getSearchDistances: getSearchDistances,
		getSearchTypes: getSearchTypes,
		addMarkerFromMyLocation: addMarkerFromMyLocation,
		addMarkersFromLocations: addMarkersFromLocations,
		removeMarkers: removeMarkers,
		createRoute: createRoute,
		removeRoute: removeRoute,
		createMarker: createMarker
	};
}]);
