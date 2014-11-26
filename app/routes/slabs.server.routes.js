'use strict';

var slabs = require('../controllers/slab.server.controller.js');
var twitterExample = require('../../app/controllers/twitter-api.server.controller');

module.exports = function(app) {

	app.route('/api-slabs')
		.get(slabs.apiList);

	app.route('/static-data-slabs')
		.get(slabs.staticDataList);

	app.route('/data-processor-slabs')
		.get(slabs.processingList);

	app.route('/output-slabs')
		.get(slabs.outputList);



	/* TESTING */
	app.route('/twitter')
		.get(twitterExample.getData);

};
