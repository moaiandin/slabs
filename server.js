'use strict';
/**
 * Module dependencies.
 */
var init 		= require('./config/init')(),
	config 		= require('./config/config'),
	mongoose 	= require('mongoose'),
	chalk 		= require('chalk'),
	redis 		= require('redis'),
	url 			= require('url');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
	if (err) {
		console.error(chalk.red('Could not connect to MongoDB!'));
		console.log(chalk.red(err));
	}
});

// Setup redis client
var redisClient;
if (config.redis === 'LOCAL') {
	redisClient = redis.createClient();
}else{
	var redisURL = url.parse(config.redis);
	redisClient = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
	redisClient.auth(redisURL.auth.split(':')[1]);
}

// Init the express application
var app = require('./config/express')(db, redisClient);

// Bootstrap passport config
require('./config/passport')();

// Start the app by listening on <port>
app.listen(config.port);

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('MEAN.JS application started on port ' + config.port);
