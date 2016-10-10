// initialize Express
var express = require('express');
var app = express();
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
