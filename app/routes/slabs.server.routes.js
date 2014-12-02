'use strict';

var slabs = require('../controllers/slab.server.controller.js');

module.exports = function(app) {

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
