app.controller("AppController", ["$scope", function($scope) {
	$scope.showModal = null;

	$scope.toggleModal = function() {
		$scope.showModal = !$scope.showModal;
		console.log($scope.showModal);
	}
}]);