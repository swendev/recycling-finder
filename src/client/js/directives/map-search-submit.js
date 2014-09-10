app.directive("mapSearchSubmit", function() {
	return {
		restrict: "E",
		scope: {
			searchModel: "=",
			searchCallback: "&"
		},
		template: "<button ng-transclude></button>",
		replace: true,
		transclude: true,
		link: function(scope, element, attrs) {
			var searchModelValue;
			var myLocation;
			var geocoder = new google.maps.Geocoder();
			scope.$watch("searchModel", function(newValue) {
				searchModelValue = newValue;
			});

			element.on("click", function() {

				geocoder.geocode( { "address": searchModelValue }, function(results, status) {

					if (status == google.maps.GeocoderStatus.OK) {
						myLocation = {
							name: results[0].formatted_address,
							lat: results[0].geometry.location.lat(),
							lng: results[0].geometry.location.lng()
						};
						// callback if place has changed
						scope.searchCallback({myLocation: myLocation});
						scope.$apply();
					} else {
						console.log("could not find " + searchModelValue);
					}

				});
			});
		}
	};
});