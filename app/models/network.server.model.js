'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Network Schema
 */
var NetworkSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	title:{
		type:String,
		default: 'Slab Network'
	},
	slabs:{
		type:Schema.Types.Mixed,
		default: {}
	},
	viewId:{
		type:String,
		default: ''
	}
});

mongoose.model('Network', NetworkSchema);
