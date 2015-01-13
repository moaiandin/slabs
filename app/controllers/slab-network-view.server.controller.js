'use strict';

/**
 * Module dependencies.
 */
var   mongoose      = require('mongoose'),
      _             = require('lodash'),
      errorHandler  = require('./errors.server.controller'),
      Q             = require('q'),
      NetworkView   = mongoose.model('NetworkView');


module.exports = function() {

    var exports = {};


    /**
     * Create a Slab network view
     */
    exports.create = function (req, res) {

    };

    /**
     * Show the current Slab network view
     */
    exports.read = function (req, res) {

        var networkId = req.params.networkViewID;
        NetworkView.findById(networkId, function (err, doc) {

            if (err) {

                res.status(400).send({
                    message: 'invalid id sent - can\'t find a saved slab network view'
                });

            } else {

                res.status(200);

                console.log(doc.outputs);
                var urlRoot = req.protocol + '://' + req.get('host');

                // set the view settings
                var isOdd = doc.outputs.length % 2 !== 0;
                var settings = {
                    isOdd: isOdd
                };

                var options = {root: urlRoot, outputs: doc.outputs, settings: settings};
                res.render('default-view', options);

            }
        });

    };

    /**
     * Update a Slab network view
     */
    exports.update = function (req, res) {

    };

    /**
     * Delete an Slab network view
     */
    exports.delete = function (req, res) {

    };

    /**
     * List of Slab network views
     */
    exports.list = function (req, res) {

    };

    return exports;

};
