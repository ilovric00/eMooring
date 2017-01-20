// initialize Express
var express = require('express');
var app = express();
var mosca = require('mosca');
var io = require('socket.io')(server);
app.use('/eMooring', express.static(__dirname + "/public"));

// merge params and env settings into config object
var params = require('./server/config/params');
var env = require('./server/config/env');
var config = new env(process.env.NODE_ENV);
config = Object.assign(config, params);

// load routes
var routes = require('./server/routes')(app, express, config);

// start server
var server = app.listen(config.port);
server.listen(config.port);
console.log('Server running on port ' + config.port + '...');

// intervals
var interval = {};

// socket.io
var io = require('socket.io')(server);
io.on('connection', function(socket){
	console.log('Client connected...');

  socket.on('disconnect', function() {
    console.log('Client disconnected...');
  });

  socket.on('startRealTimeMode', function(id) {
    console.log('Get real time data for widget ' + id);
    GetRealtimeData(id);
  });

  socket.on('stopRealTimeMode', function(id) {
    console.log('Stop real time mode for widget ' + id);
    clearInterval(interval[id]);
  });

});

function GetRealtimeData(id){
  var dataSet = {};
  interval[id] = setInterval(myMethod, 5000);
  console.log("intervalId: " + interval[id]);

  function myMethod(){
    dataSet.id = ++dataSet.id || 0;
    dataSet.content = 'Sensor No.'+id;
    dataSet.start = Date.now();
    dataSet.end = dataSet.start + 2500;
    io.emit('startRealTimeMethod', id, dataSet);

    console.log(dataSet);
  }
};



// Mosca ----------------------------------------
var ascoltatore = {
  //using ascoltatore
  type: 'mongo',        
  url: 'mongodb://localhost:27017/mqtt',
  pubsubCollection: 'ascoltatori',
  mongo: {}
};

var moscaSettings = {
  port: 1883,
  backend: ascoltatore,
  persistence: {
    factory: mosca.persistence.Mongo,
    url: 'mongodb://localhost:27017/mqtt'
  }
};

var mosca_server = new mosca.Server(moscaSettings);
mosca_server.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running')
}

// fired when a client connects
//mosca_server.on('clientConnected', function(client) {
// console.log('Client Connected:', client.id);
//});

// when a client is subscribed to a topic
mosca_server.on('subscribed', function(topic, client) {
console.log('Topic subscribed: ', topic);
});

// when a client is unsubscribed to a topic
mosca_server.on('unsubscribed', function(topic, client) {
console.log('Topic unsubscribed: ', topic);
});

// when a client publishes the message
mosca_server.on('published', function(topic, client) {
if (typeof topic.payload === 'object' && typeof topic.payload !== null){
    console.log('Published: ', topic.payload.toString());
    console.log('\n');
  }
  else{
    return
  }
});

// fired when a client disconnects
//mosca_server.on('clientDisconnected', function(client) {
//  console.log('Client Disconnected:', client.id);
//});