app.controller("MapController", ["$scope", "mapFactory", "geoApiFactory", function($scope, mapFactory, geoApiFactory) {
	var autocomplete;
	var place;
	var animationEndHandlerNames = ["animationend", "webkitAnimationEnd", "oAnimationEnd", "MSAnimationEnd"];

	$scope.searchDistances = mapFactory.getSearchDistances();
	$scope.searchTypes = mapFactory.getSearchTypes();
	$scope.searchDistance = $scope.searchDistances[0];
	$scope.searchType = $scope.searchTypes[0];
	$scope.showLocations = null;
	$scope.showSideBar = null;
	$scope.locations = [];

	// add listener for result hide/show
	var resultBox = document.getElementById("results");
	angular.forEach(animationEndHandlerNames, function(animationName, key) {
		resultBox.addEventListener(animationName, function() {
			console.log("event ended");
		}, false);
	});

	// get all necessary params to setup a map
	var mapOptions = {
		center: new google.maps.LatLng(51.000, 10.200),
		zoom: 6,
		disableDefaultUI: true,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var searchOptions = {
		componentRestrictions: {country: "de"},
		type: ["address"]
	};
	var mapCanvas = document.getElementById("map-canvas");
	var searchInput = document.getElementById("map-search");

	// create Map
	autocomplete = mapFactory.setupMap(mapCanvas, searchInput, mapOptions, searchOptions);

	// add event listeners
	var submitButton = document.getElementById("submit");
	$scope.search = function() {
		event();
	};
	google.maps.event.addListener(autocomplete, 'place_changed', function() {
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
				$scope.locations = response.data;
				console.log($scope.locations);
				var locationCount = mapFactory.addMarkersFromLocations(response.data);
				if(locationCount > 0) {
					$scope.showLocations = true;
				}
			}, function () {
				// error
			});
		}
	}

	// create Route
	$scope.createRoute = function(location) {
		mapFactory.createRoute(location);
	};

	$scope.rollDown = function($event) {
		console.log($event.target.next());
	};
}]);