'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash');



var assignPriorities = function(slabs){

    return slabs;
};

/**
 * Create a Slab network
 */
exports.create = function(req, res) {

    var title = req.body.title;
    var slabs = req.body.slabs;

    if(slabs.length > 0){

        res.status(200);

        slabs = assignPriorities(slabs);

        //_(slabs).sortBy('priority');

        _.forEach(slabs, function(item){

            console.log(item);

        });

        res.send({status:'success'});


    } else {
        res.status(400).send({
            message: 'invalid data sent - can\'t create slab network'
        });
    }

};

/**
 * Show the current Slab network
 */
exports.read = function(req, res) {

};

/**
 * Update a Slab network
 */
exports.update = function(req, res) {

};

/**
 * Delete an Slab network
 */
exports.delete = function(req, res) {

};

/**
 * List of Slab networks
 */
exports.list = function(req, res) {

};
