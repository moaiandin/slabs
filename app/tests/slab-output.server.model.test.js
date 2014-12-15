'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	SlabOutput = mongoose.model('SlabOutput');

/**
 * Globals
 */
var slabOutput;

/**
 * Unit tests
 */
describe('Slab output Model Unit Tests:', function() {

	beforeEach(function(done) {

		slabOutput = new SlabOutput({
			title : 'test slab output',
			settings : { prop : 'test property'},
			data : { prop : 'test property'}
		});

		done();

	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return slabOutput.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		SlabOutput.remove().exec();
		done();
	});

});
