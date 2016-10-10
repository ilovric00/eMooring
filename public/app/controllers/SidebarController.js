app.controller('SidebarController', function($scope, AppService) {

	// send data objects to service and toogle checkbox class
	$scope.setDataObjects = function(data, uid) {
		if (data != undefined){
			AppService.setObjects(data);
		}
	};

});
