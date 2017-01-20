module.exports = function(env){
	switch(env) {
		// production settings
		case 'production':
			return {
				'dbHost': '172.0.0.1:27018',
				'dbName' : 'emoooring-productionDb',
				'port': 80,
				'moscaPort': 1883
			};
		// when using nodemon, development settings will be applied
		default:
			return {
				'dbHost': 'localhost:27017',
				//'dbName' : 'emoooring-localDb',
				'dbName' : 'demo',
				'port': 3000,
				'moscaPort': 1883,
				'environment': 'Development'
			};
	}
};