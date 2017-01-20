var bodyParser = require('body-parser');
var mongojs = require('mongojs');

module.exports = function(app, express, config){
	var db = mongojs(config.dbName, config.dbCollections);
	app.use(bodyParser.json({limit: '100mb'}));

	// get all widgets for Angular
	app.get('/widgets', function(req, res) {
		db.widgets.find(function (err, docs){
			if(docs.length != 0){
				console.log("Widgets received from MongoDB...");
				res.json(docs);
			} else {
				console.log("There is no widgets in MongoDB...");
				res.json(null);
			}
		});
	});
	
	// get single widget for Angular
	app.get('/widgets/:id', function(req, res){
		var id = parseInt(req.params.id, 10);
		db.widgets.findOne({_id: id}, function(err, doc){
			if(doc){
				console.log("Widget with ID " + id + " found");
				res.json(doc);
			} else{
				console.log("Widget with ID " + id + " not found");
				res.send("Not found");
			}
		});
	});

}