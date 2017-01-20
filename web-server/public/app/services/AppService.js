app.service("AppService", function($http) {

    // GET all widgets from server 
    this.getWidgets = function() {
        return $http.get('/widgets');
    };
	
	//GET single widget from server
    this.getWidget = function (id) {
        return $http.get('/widgets/' + id);
    };

});