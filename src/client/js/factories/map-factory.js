app.factory("mapFactory", ["$http", "geoApiFactory", function($http, geoApiFactory) {
	var map;
	var autocomplete;
	var locationAutocomplete;
	var markers = [];
	var myLocation;
	var directionsDisplay;
	var directionsService;

	function setupMap(mapCanvas, searchInput, mapOptions, searchOptions) {
		map = new google.maps.Map(mapCanvas, mapOptions);
		autocomplete = new google.maps.places.Autocomplete(searchInput, searchOptions);
		return autocomplete;
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

	function getPosition(completer) {
		var place = completer.getPlace();
		if (place !== undefined) {
			return place;
		} else {
			return null;
		}
	}

	function addMarkerFromPlace(place) {
		var marker = new google.maps.Marker({
			map: map,
			title: place.name,
			position: place.geometry.location
		});
		markers.push(marker);
		myLocation = new google.maps.LatLng(place.geometry.location.k,place.geometry.location.B);
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
		var latLng = new google.maps.LatLng(location.loc.coordinates[0],location.loc.coordinates[1]);
		var newMarker = new google.maps.Marker({
			map: map,
			title: location.name,
			position: latLng,
			icon: new google.maps.MarkerImage("img/svg/" + icon + ".svg",	null, null, null, new google.maps.Size(36,36)),
			animation: google.maps.Animation.DROP
		});
		/* don't need event listeners for now
		google.maps.event.addListener(newMarker, 'click', function() {
			console.log("Bin ein Klicklistener");
		}); */
		return newMarker;
	}

	function addMarkersFromLocations(locations) {
		removeRoute();

		angular.forEach(locations, function(location, key) {
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
		var destination = new google.maps.LatLng(location.loc.coordinates[0],location.loc.coordinates[1]);

		directionsService = new google.maps.DirectionsService();
		var rendererOptions = {
			map: map,
			suppressMarkers: true
		};
		directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
		//directionsDisplay.setDirections({routes: []});

		var request = {
			origin: myLocation,
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
		getPosition: getPosition,
		addMarkerFromPlace: addMarkerFromPlace,
		addMarkersFromLocations: addMarkersFromLocations,
		removeMarkers: removeMarkers,
		createRoute: createRoute,
		removeRoute: removeRoute,
		createMarker: createMarker
	};
}]);
