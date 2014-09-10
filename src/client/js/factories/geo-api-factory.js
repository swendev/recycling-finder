app.factory("geoApiFactory", ["$http", function($http) {
	return {
		getMarkers: function(lat, lng, type, radius) {
			console.log(lng, lat);
			return $http.get("http://recfinder.pixelforyou.de/api/locations/near/" + lng + "/" + lat + "/" + type + "/" + radius);
		},
		setNewLocation: function(data) {
			return $http.post("http://recfinder.pixelforyou.de/api/locations/", data);
		}
	};
}]);
