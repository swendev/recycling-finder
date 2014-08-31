app.factory("mapFactory", ["$http", "geoApiFactory", function($http, geoApiFactory) {
	var map;
	var searchBox;
	var markers = [];

	return {
		setupMap: function(mapCanvas, searchInput, mapOptions, searchOptions) {
			map = new google.maps.Map(mapCanvas, mapOptions);
			searchBox = new google.maps.places.SearchBox(searchInput, searchOptions);
			return searchBox;
		},
		getSearchDistances: function() {
			return [
				{text: "500m",  value: 500},
				{text: "1km",   value: 1000},
				{text: "2,5km", value: 2500},
				{text: "5km",   value: 5000}
			];
		},
		getSearchTypes: function() {
			return [
				{text: "Alle",          value: "all"},
				{text: "Papier",        value: "paper"},
				{text: "Glas",          value: "glass"},
				{text: "Grüner Punkt",  value: "plastic"}
			];
		},
		getPosition: function() {
			var places = searchBox.getPlaces();
			if (places !== undefined) {
				return places[0];
			} else {
				return null;
			}

		},
		addMarkerFromPlace: function(place) {
			var marker = new google.maps.Marker({
				map: map,
				title: place.name,
				position: place.geometry.location,
			});
			markers.push(marker);
			map.setZoom(15);
			map.panTo(marker.position);
		},
		addMarkerFromLocation: function(location) {
			var latLng = new google.maps.LatLng(location.loc.coordinates[0],location.loc.coordinates[1]);
			var marker = new google.maps.Marker({
				map: map,
				title: location.name,
				position: latLng,
				animation: google.maps.Animation.DROP
			});
			markers.push(marker);
		},
		removeMarkers: function() {
			angular.forEach(markers, function(marker, key) {
				marker.setMap(null);
			});
		}
	};
}]);
