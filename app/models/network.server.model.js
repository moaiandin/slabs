'use strict';

/**
 * Module dependencies.
 */
var mongoose 				= require('mongoose'),
	Schema 						= mongoose.Schema;

/**
 * Network Schema
 */
var NetworkSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	lastRun:{
		type: Number,
		default: function(){
			var now = new Date();
			return now.valueOf();
		}
	},
	tickerInterval:{
		type:Number,
		default : 7200000 // every 12 hours
	},
	title:{
		type:String,
		default: 'Slab Network'
	},
	slabs:{
		type:Schema.Types.Mixed,
		default: {}
	},
	outputs:{
		type:[],
		default:[]
	}
});

mongoose.model('Network', NetworkSchema);
