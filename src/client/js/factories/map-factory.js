app.factory("mapFactory", ["$http", "geoApiFactory", function($http, geoApiFactory) {
	var map;
	var autocomplete;
	var markers = [];
	var myLocation;
	var directionsDisplay;
	var directionsService;

	function setupMap(mapCanvas, searchInput, mapOptions, searchOptions) {
		map = new google.maps.Map(mapCanvas, mapOptions);
		autocomplete = new google.maps.places.Autocomplete(searchInput, searchOptions);
		return autocomplete;
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
			{text: "Alle",          value: "all"},
			{text: "Papier",        value: "paper"},
			{text: "Glas",          value: "glass"},
			{text: "Grüner Punkt",  value: "plastic"}
		];
	}
	function getPosition() {
		var place = autocomplete.getPlace();
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
		google.maps.event.addListener(newMarker, 'click', function() {
			console.log("Bin ein Klicklistener");
		});
		return newMarker;
	}

	function addMarkersFromLocations(locations) {
		console.log(locations);
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
		console.log(myLocation);
		var destination = new google.maps.LatLng(location.loc.coordinates[0],location.loc.coordinates[1]);
		console.log(destination);

		directionsService = new google.maps.DirectionsService();
		var rendererOptions = {
			map: map,
			suppressMarkers: true
		};
		directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
		directionsDisplay.setDirections({routes: []});

		var request = {
			origin: myLocation,
			destination: destination,
			travelMode: google.maps.TravelMode.WALKING
		};

		directionsService.route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				console.log(response.routes[0].warnings);
				directionsDisplay.setDirections(response);
				console.log(response);
			}
		});
	}

	return {
		setupMap: setupMap,
		getSearchDistances: getSearchDistances,
		getSearchTypes: getSearchTypes,
		getPosition: getPosition,
		addMarkerFromPlace: addMarkerFromPlace,
		addMarkersFromLocations: addMarkersFromLocations,
		removeMarkers: removeMarkers,
		createRoute: createRoute,
		createMarker: createMarker
	};
}]);
