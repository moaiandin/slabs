'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * NetworkView Schema
 */
var NetworkViewSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	settings:{
		type:Schema.Types.Mixed,
		default: {}
	},
	outputs:[]
});

mongoose.model('NetworkView', NetworkViewSchema);
