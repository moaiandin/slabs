'use strict';

var apiSlabs = require('../../app/controllers/api-slabs.server.controller');
var twitterExample = require('../../app/controllers/twitter-api.server.controller');

module.exports = function(app) {

	app.route('/api-slabs')
		.get(apiSlabs.list);

	app.route('/twitter')
		.get(twitterExample.getData);

};
