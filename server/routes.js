var bodyParser = require('body-parser');
var mongojs = require('mongojs');

module.exports = function(app, express, config){
	var db = mongojs(config.dbName, config.dbCollections);
	app.use(bodyParser.json({limit: '100mb'}));

	// get widgets for Angular
	app.get('/widgets', function(req, res) {
		db.widgets.find(function (err, docs){
			console.log("Widgets received from MongoDB...");
			res.json(docs);
		});
	});

}