'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * SlabOutput Schema
 */
var SlabOutputSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	categories:{
		type:[],
		default: []
	},
	labels:{
		type:Schema.Types.Mixed,
		default: {}
	},
	values:{
		type:[],
		default: []
	},
	settings:{
		type:Schema.Types.Mixed,
		default: {}
	},
	data:{
		type:Schema.Types.Mixed,
		default: []
	}
});

mongoose.model('SlabOutput', SlabOutputSchema);
