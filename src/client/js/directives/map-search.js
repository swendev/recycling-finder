app.directive("mapSearch", function() {
	return {
		restrict: "E",
		scope: {
			searchModel: "=",
			searchCallback: "&"
		},
		template: "<input ng-model='searchModel'/>",
		replace: true,
		link: function(scope, element, attrs) {
			var searchOptions = {};
			var myPlace;
			var autocomplete;
			var onPlaceChange;
			var autocompleteListener;
			if(attrs.country === undefined) {
				searchOptions = { type: ["address"] };
			} else {
				searchOptions = {
					componentRestrictions: {country: attrs.country},
					type: ["address"]
				};
			}

			// setup google maps autocomplete
			autocomplete = new google.maps.places.Autocomplete(element[0], searchOptions);
			onPlaceChange = function() {
				myPlace = {
					name: autocomplete.getPlace().formatted_address,
					lat: autocomplete.getPlace().geometry.location.lat(),
					lng: autocomplete.getPlace().geometry.location.lng()
				};
				// callback if place has changed
				scope.searchCallback({myLocation: myPlace});
				scope.$apply();
			};
			autocompleteListener = google.maps.event.addListener(autocomplete, 'place_changed', onPlaceChange);

			// reset place
			scope.$watch("searchModel", function(newValue) {
				if(newValue === "") {
					//console.log("reset");
				}
			});
		}
	};
});
