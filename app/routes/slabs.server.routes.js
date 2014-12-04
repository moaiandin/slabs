'use strict';

var slabs = require('../controllers/slab.server.controller.js');
var slabNetwork = require('../controllers/slab-network.server.controller.js');

module.exports = function(app) {

	/* Slabs */
	app.route('/network/')
		.post(slabNetwork.create);

	/* Slab Types */
	app.route('/slab/types/')
		.get(slabs.types);

	/* Slab Lists */
	app.route('/slab/:slabType')
		.get(slabs.slabList);

	/* Slab Settings */
	app.route('/slab/:slabType/:slabID')
		.get(slabs.settings);

};
