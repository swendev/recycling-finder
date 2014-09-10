app.controller("ModalController", ["$scope", "mapFactory", "geoApiFactory", function($scope, mapFactory, geoApiFactory) {

	$scope.myLocationName ="";
	$scope.myLocation = null;
	$scope.searchTypes = mapFactory.getSearchTypes();
	$scope.showModal = null;
	$scope.formData = {
		"location": null,
		"types": null
	};

	$scope.modal = function() {
		$scope.showModal = !$scope.showModal;
		$scope.showSideBar = !$scope.showSideBar;
	};

	$scope.search = function(newLocation) {
		console.log(newLocation);
		$scope.formData.location = newLocation;
	};

	// create new location
	$scope.addRecyclingLoc = function() {
		// check if place has been selected
		if($scope.formData.location !== "") {
			// add location type to string for each checked checkbox
			angular.forEach($scope.searchTypes, function(searchType, idx) {
				if(searchType.isChecked) {
					if ($scope.formData.types === null) {
						console.log(searchType.value);
						$scope.formData.types = searchType.value;
					} else {
						$scope.formData.types += "," + searchType.value;
					}
				}
			});
		} else {
			// error if no place has been selected
			console.log("Kein Standort ausgewählt");
		}
		// check if any ckeckbox has been checked
		if($scope.formData.types !== null) {
			console.log($scope.formData);
			var data = {
				name: $scope.formData.location.name,
				lat: $scope.formData.location.lat,
				lng: $scope.formData.location.lng,
				geometry: "Point",
				types: $scope.formData.types
			};
			console.log(data);

			geoApiFactory.setNewLocation(data).then(function(response) {
					console.log(response);
				},
				function(err) {
					// error handling
				});
			$scope.myLocationName ="";
			$scope.formData.types = null;
		} else {
			// error if no checkbox has been checked
		}
	};
}]);