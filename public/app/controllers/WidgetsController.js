app.controller('WidgetsController', function ($scope, AppService, socket) {

	$scope.widget = {};
	$scope.widgets = [];
	
	// get all widgets from service
	AppService.getWidgets().then(function(response){
		response.data.forEach(function(widget){
			// if widget contains timeline chart
			if(widget.timeline){
				AddTimelineChart(widget);
			}
		});
	});

	//add timeline widget
	function AddTimelineChart(widget) {
		var id = widget._id;
		$scope.widget[id] = {};
		console.log("Timeline widget " + id + " received from server...");
		$scope.widget[id].id = id;
		$scope.widget[id].title = 'Post Processing - Sensor No.' + id;
		$scope.widget[id].isActive = false;
		$scope.widget[id].timeline = new vis.DataSet();
		$scope.widget[id].timeline = widget.timeline.data;
		// add created widget to array of widgets
		$scope.widgets.push($scope.widget[id]);
	}; 

	// remove graph widget 
	$scope.removeWidget = function(widget) {
		var index = $scope.widgets.indexOf(widget);
		$scope.widgets.splice(index, 1);
	};

	// start realtime mode - stop post processing
    $scope.startRealTimeMode = function(id){
		$scope.widget[id].isActive = true;
		$scope.widget[id].title = 'Real Time - Sensor No.' + id;
		$scope.widget[id].timeline = new vis.DataSet();
		socket.emit('startRealTimeMode', id);
    };

    // stop realtime mode - start post processing
    $scope.stopRealTimeMode = function(id){
		$scope.widget[id].isActive = false;
		$scope.widget[id].title = 'Post Processing - Sensor No.' + id;
		//AddTimelineChart(id, $scope.widget[id].timeline);
		socket.emit('stopRealTimeMode', id);
    };

    // realtime data stream from sensor client
    socket.on('startRealTimeMethod', function (index, ds) {
    	$scope.widget[index].timeline.add([
    		{content: ds.content, start: ds.start, end: ds.end}
    	]);
    }); 

});