'use strict';

var apiSlabs = require('../../app/controllers/api-slabs.server.controller');

module.exports = function(app) {
	app.route('/api-slabs')
		.get(apiSlabs.list);
};
