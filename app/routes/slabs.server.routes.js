'use strict';

module.exports = function(app, redisClient) {

	var slabs 			= require('../controllers/slab.server.controller.js')(redisClient);
	var slabNetwork = require('../controllers/slab-network.server.controller.js')(redisClient);
	var slabNetworkView = require('../controllers/slab-network-view.server.controller.js')(redisClient);

	// todo - not sure if some of these slabs should have there own controllers
	// todo - at the moment there are only 'network' and 'slab' controllers.

	/* Data For An Output Slab */
	app.route('/getdata/:outputid')
		.get(slabNetwork.getOutputData);

	/* Create and List Slab Networks */
	app.route('/network/')
		.post(slabNetwork.create)
		.get(slabNetwork.list)
		.put(slabNetwork.update);

	app.route('/network/:networkId')
		.get(slabNetwork.read);

	/* Return Slab Network View */
	app.route('/networkview/:networkViewID')
		.get(slabNetworkView.read);

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
