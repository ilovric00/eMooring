app.service("AppService", function($http) {

    // GET all widgets from server 
    this.getWidgets = function() {
        return $http.get('/widgets');
    };

});