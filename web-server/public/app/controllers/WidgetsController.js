app.controller('WidgetsController', function ($scope, $rootScope, AppService, socket, toastr) {

	$scope.widget = {};
	$rootScope.widgets = [];

	// get all widgets from service
	AppService.getWidgets().then(function(response){
		if(response.data){
			response.data.forEach(function(widget){
				// if widget contains timeline chart
				if(widget.timeline)
					AddTimelineChart(widget);
			});
		}
		else{
			toastr.error("There is no widgets in database!", 'Empty database');
		}
	});

	//add timeline widget
	function AddTimelineChart(widget) {
		var id = widget._id;
		$scope.widget[id] = {};
		toastr.success("Timeline widget " + id + " received from server...", 'Success');
		$scope.widget[id].id = widget._id;
		$scope.widget[id].title = 'Post Processing - Sensor No. ' + id;
		$scope.widget[id].isActive = false;
		$scope.widget[id].isVisible = true;
		$scope.widget[id].timeline = new vis.DataSet();
		$scope.widget[id].timeline = widget.timeline.data;
		$scope.widget[id].options = {height: '210px'};
		// add widget to widgets array
		$rootScope.widgets.push($scope.widget[id]);
	}; 

	// remove graph widget 
	$scope.removeWidget = function(widget) {
		var index = $scope.widgets.indexOf(widget);
		$rootScope.widgets.splice(index, 1);
		toastr.error("Timeline widget " + widget.id + " is removed...", 'Removed');
	};

	// start realtime mode - stop post processing
    $scope.startRealTimeMode = function(id){
		$scope.widget[id].isActive = true;
		$scope.widget[id].title = 'Real Time - Sensor No. ' + id;
		$scope.widget[id].timeline = new vis.DataSet();
		$scope.widget[id].options = {height: '210px', start: new Date(), end: new Date(new Date().getTime() + 10000), rollingMode: true};
    	toastr.info("Receiving real time data for widget " + id, 'Real Time ON');
    };

    // stop realtime mode
    $scope.stopRealTimeMode = function(id){
		$scope.widget[id].isActive = false;
		$scope.widget[id].title = 'Results - Real Time - Sensor No. ' + id;
		socket.emit('stopRealTimeMode', id);
		toastr.warning("Stop of receiving real time data for widget " + id, 'Real Time OFF');
    };

    // refresh post processing data
    $scope.refreshWidget = function(id){
		$scope.widget[id].isActive = false;
		$scope.widget[id].title = 'Post Processing - Sensor No. ' + id;
		$scope.widget[id].options = {height: '210px'};
		socket.emit('stopRealTimeMode', id);
		// get single widget from service
		AppService.getWidget(id).then(function(response){
			toastr.success("Timeline widget " + id + " received from server...", 'Refresh');
			$scope.widget[id].timeline = response.data.timeline.data;
		});
    };

   	// get widget info
	$scope.getInfo = function(id){
		var string = '';
		console.log($scope.widget[id].timeline.length);
		//string
		string = "Number of time series: " + $scope.widget[id].timeline.length;
		toastr.info(string, 'Sensor No.' + id,{
			timeOut: 0,
			extendedTimeOut: 0,
			positionClass: 'toast-top-right',
			iconClass: 'toast-custom'
		});
	};

    // realtime data stream from mosca broker
    socket.on('moscaServerToClient', function(ts){
    	var id = ts._id;
    	// if real time mode is enabled - widget is active
	    if($scope.widget[id].isActive){
	        $scope.widget[id].timeline.add([
	    		{content: ts.timeline.data[0].content, start: ts.timeline.data[0].start, end: ts.timeline.data[0].end}
	    	]);
    	}
    	else{
    		console.log("Widget " + id + " is not in real time mode...");
    	}
    });

    // toogle widgets
	$rootScope.toogleWidgets = function(widget){
		if(widget.isVisible){
			$scope.widget[widget.id].isVisible = false;
		}else{
			$scope.widget[widget.id].isVisible = true;
		}
	}; 

});