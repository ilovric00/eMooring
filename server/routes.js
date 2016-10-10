var bodyParser = require('body-parser');
var mongojs = require('mongojs');

module.exports = function(app, express, config){
	var db = mongojs(config.dbName, config.dbCollections);
	app.use(bodyParser.json({limit: '100mb'}));

	// get dataObject for Angular
	app.get('/data/:id', function(req, res) {
		var id = parseInt(req.params.id, 10);
		db.dataObject.findOne({
			_id: id
		}, function(err, doc) {
			if (doc) {
				console.log("Data object with ID " + id + " found");
				res.json(doc);
			} else {
				console.log("Data object with ID " + id + " not found");
				res.send("Not found");
			}
		});
	});

}