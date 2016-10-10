app.service("AppService", function($http) {

    //GET dataObject from server 
    this.getDataObject = function(id) {
        return $http.get('/data/' + id);
    };

});