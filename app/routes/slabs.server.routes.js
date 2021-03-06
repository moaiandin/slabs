'use strict';

module.exports = function(app, redisClient) {

	var slabs 			= require('../controllers/slab.server.controller.js')(redisClient);
	var slabNetwork = require('../controllers/slabNetwork.server.controller.js')(redisClient);

	// todo - not sure if some of these slabs should have there own controllers
	// todo - at the moment there are only 'network' and 'slab' controllers.

	/* Data For An Output Slab */
	app.route('/getdata/:outputid')
		.get(slabNetwork.getOutputData);

	/* Create and List Slab Networks */
	app.route('/network/')
		.post(slabNetwork.create)
		.get(slabNetwork.listByCreated)
		.put(slabNetwork.update);

	/* List of networks by Upvotes*/
	app.route('/network/byupvote/')
		.get(slabNetwork.listByVotes);

  /* Get Network */
	app.route('/network/:networkId')
		.get(slabNetwork.read);

	/* Upvote network */
	app.route('/network/upvote/:networkId')
		.get(slabNetwork.upVote);

	/* Return Slab Network View */
	app.route('/networkview/:networkID')
		.get(slabNetwork.createView);

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
