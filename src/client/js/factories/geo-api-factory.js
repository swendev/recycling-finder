app.factory("geoApiFactory", ["$http", function($http) {
	return {
		getMarkers: function(lng, lat, type, radius) {
			return $http.get("http://localhost:8080/api/locations/near/" + lng + "/" + lat + "/" + type + "/" + radius);
		},
		setNewLocation: function(data) {
			return $http.post("http://localhost:8080/api/locations/", data);
		}
	};
}]);
