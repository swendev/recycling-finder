app.controller("MapController", ["$scope", "mapFactory", "geoApiFactory", function($scope, mapFactory, geoApiFactory) {
	var animationEndHandlerNames = ["animationend", "webkitAnimationEnd", "oAnimationEnd", "MSAnimationEnd"];

	$scope.myLocationName = "";
	$scope.myLocation = null;

	$scope.searchDistances = mapFactory.getSearchDistances();
	$scope.searchTypes = mapFactory.getSearchTypes();
	$scope.searchDistance = $scope.searchDistances[0];
	$scope.searchType = $scope.searchTypes[0];
	$scope.showLocations = null;
	$scope.showSideBar = null;
	$scope.showReleaseInfo = true;
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
	var mapCanvas = document.getElementById("map-canvas");

	// create Map
	mapFactory.setupMap(mapCanvas, mapOptions);

	$scope.search = function(myLocation) {
		if(myLocation !== undefined) {
			$scope.myLocation = myLocation;
		}
		if($scope.myLocation !== null) {
			mapFactory.removeMarkers();
			mapFactory.addMarkerFromMyLocation($scope.myLocation);
			// get promise for matching places in radius
			console.log($scope.searchDistance);
			geoApiFactory.getMarkers($scope.myLocation.lat, $scope.myLocation.lng, $scope.searchType.value, $scope.searchDistance.value).then(function (response) {
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
	};

	// create Route
	$scope.createRoute = function(location) {
		mapFactory.createRoute(location);
	};

	$scope.rollDown = function($event) {
		console.log($event.target.next());
	};

}]);