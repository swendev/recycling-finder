app.controller("ModalController", ["$scope", "mapFactory", "geoApiFactory", function($scope, mapFactory, geoApiFactory) {
	var locationAutocomplete;

	$scope.searchTypes = mapFactory.getSearchTypes();
	$scope.showModal = null;
	$scope.formData = {
		"place": null,
		"types": null
	};

	var searchOptions = {
		componentRestrictions: {country: "de"},
		type: ["address"]
	};

	//create autocomplete
	var locationSearch =  document.getElementById("location-search");
	locationAutocomplete = mapFactory.setupAutocomplete(locationSearch, searchOptions);

	var onPlaceChange = function() {
		$scope.formData.place = mapFactory.getPosition(locationAutocomplete);
	};
	var locationAutocompleteListener = google.maps.event.addListener(locationAutocomplete, 'place_changed', onPlaceChange);

	$scope.modal = function() {
		$scope.showModal = !$scope.showModal;
		$scope.showSideBar = !$scope.showSideBar;
	};

	// create new location
	$scope.addRecyclingLoc = function() {
		// check if place has been selected
		if($scope.formData.place !== "") {

			// add location type to string for each checked checkbox
			angular.forEach($scope.searchTypes, function(searchType, idx) {
				if(searchType.isChecked) {
					if ($scope.formData.types === null) {
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
				name: $scope.formData.place.name,
				lat: $scope.formData.place.geometry.location.B,
				lng: $scope.formData.place.geometry.location.k,
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
			$scope.formData.input = "";
			google.maps.event.removeListener(locationAutocompleteListener);
			locationAutocompleteListener = google.maps.event.addListener(locationAutocomplete, 'place_changed', onPlaceChange);
			$scope.formData.types = null;
		} else {
			// error if no checkbox has been checked
		}
	};
}]);