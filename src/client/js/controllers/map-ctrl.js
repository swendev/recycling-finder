app.controller("MapController", [function() {
	var mapOptions = {
		center: new google.maps.LatLng(51.000, 10.200),
		zoom: 6,
		disableDefaultUI: true,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
}]);