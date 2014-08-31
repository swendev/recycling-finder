app.controller("MapController", ["$scope", "mapFactory", "geoApiFactory", function($scope, mapFactory, geoApiFactory) {
	var searchBox;
	var place;
	$scope.searchDistances = mapFactory.getSearchDistances();
	$scope.searchTypes = mapFactory.getSearchTypes();
	$scope.searchDistance = $scope.searchDistances[0];
	$scope.searchType = $scope.searchTypes[0];

	// get all necessary params to setup a map
	var mapOptions = {
		center: new google.maps.LatLng(51.000, 10.200),
		zoom: 6,
		disableDefaultUI: true,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var searchOptions = {
		componentRestrictions: {country: "de"}
	};
	var mapCanvas = document.getElementById("map-canvas");
	var searchInput = document.getElementById("map-search");

	// create Map
	searchBox = mapFactory.setupMap(mapCanvas, searchInput, mapOptions, searchOptions);

	// add event listeners
	var submitButton = document.getElementById("submit");
	$scope.submit = function() {
		event();
	};
	google.maps.event.addListener(searchBox, 'places_changed', function() {
		event();
	});

	// function to remove old makers and add new ones to the map on event
	function event() {
		place = mapFactory.getPosition();
		if(place !== null) {
			mapFactory.removeMarkers();
			mapFactory.addMarkerFromPlace(place);
			// get promise for matching places in radius
			console.log($scope.searchDistance);
			geoApiFactory.getMarkers(place.geometry.location.k, place.geometry.location.B, $scope.searchType.value, $scope.searchDistance.value).then(function (response) {
				console.log(response);
				angular.forEach(response.data, function(location, key) {
					mapFactory.addMarkerFromLocation(location);
				});
			}, function () {
				// error
			});
		}
	}
}]);