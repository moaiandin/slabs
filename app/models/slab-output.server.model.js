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
	title: {
		type: String,
		default: '',
		trim: true,
		required: 'Title cannot be blank'
	},
	settings:{
		type:Schema.Types.Mixed,
		default: {}
	},
	data:{
		type:Schema.Types.Mixed,
		default: {}
	}
});

mongoose.model('SlabOutput', SlabOutputSchema);
