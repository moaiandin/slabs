'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash');

/**
 * Create a Api slab
 */
exports.create = function(req, res) {

};

/**
 * Show the current Api slab
 */
exports.read = function(req, res) {

};

/**
 * Update a Api slab
 */
exports.update = function(req, res) {

};

/**
 * Delete an Api slab
 */
exports.delete = function(req, res) {

};

/**
 * List of Api slabs
 */

var apiSlabList = [{name:'twitter'},{name:'facebook'}];
exports.list = function(req, res) {

    res.status(200);
    res.json(apiSlabList);

};
