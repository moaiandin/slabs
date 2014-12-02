'use strict';

var slabs = require('../controllers/slab.server.controller.js');

module.exports = function(app) {

	/* Slab Lists */

	// todo - these 4 should all be one end point

	app.route('/api-slabs')
		.get(slabs.apiList);

	app.route('/static-data-slabs')
		.get(slabs.staticDataList);

	app.route('/data-processor-slabs')
		.get(slabs.processingList);

	app.route('/output-slabs')
		.get(slabs.outputList);


	/* Slab Settings */
	app.route('/slab/:slabName')
		.get(slabs.settings);

};
