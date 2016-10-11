app.controller('WidgetsController', function ($scope, AppService) {

	$scope.widget = {};
	$scope.widgets = [];
	
	// get all widgets from service
	AppService.getWidgets().then(function(response){
		response.data.forEach(function(widget){
			// if widget contains graph
			if(widget.graph){
				$scope.widgets.push(widget._id);
				AddGraph(widget._id, widget.graph, widget.title);
			}
		});
	});

	//add graph widget
	function AddGraph(id ,graph, title) {
		console.log("Graph widget " + id + " received from server...");
		$scope.widget[id] = [];
		$scope.widget[id].graph = graph;
		$scope.widget[id].title = title;
		$scope.widget[id].options = {
			xaxes : [ {
				mode : 'time'
			} ],
			yaxes : [ {
				min : 0,
				position : 'left'
			},
			{
				min : 0,
				alignTicksWithAxis : 1,
				position : 'right'
			} ],
			legend: {
			  container: '#legend-' + id,
			  show: true,
			  noColumns : 10
			},
			lines: {
				show : true
			},
			grid: {
				hoverable : true,
				borderWidth: 1,
				borderColor: "#eaedf1",
				color: "#3a4653",
				backgroundColor: { colors: ["#fff", "#eee"] }
			},
			tooltip : true,
			tooltipOpts : {
				content : "%s for %x was %y"
			},
			zoom: {
				interactive: true
			},
			pan: {
				interactive: true
			}
		};
	}; 

	// remove graph widget 
	$scope.removeWidget = function(id) {
		var index = $scope.widgets.indexOf(id);
		$scope.widgets.splice(index, 1);
	};

});