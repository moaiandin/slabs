'use strict';

// todo - write a grunt module that basically checks out a list of grunt repos in slabs.json and puts them
// todo - into a folders - it uses the property names to create the folder structure.
// todo - Then add this grunt task to the shippable.yml so the slabs are available online.

// todo - the slabList function needs to scan the slabs.json file to return which slabs are available.

/**
 * Module dependencies.
 */
var mongoose     = require('mongoose'),
    _            = require('lodash'),
    swig         = require('swig'),
    path         = require('path'),
    errorHandler = require('./errors.server.controller'),
    redis        = require('redis');


module.exports = function(redisClient) {

    var exports = {};

    /**
     * Get the lists of slab types
     */
    exports.types = function (req, res) {

        /* HARDCODED SLAB TYPES */
        var slabTypes = [
            {id: 'api', label: 'api\'s'},
            {id: 'static', label: 'static data'},
            {id: 'processing', label: 'data processors'},
            {id: 'output', label: 'data output'}
        ];

        res.status(200);
        res.json(slabTypes);
    };


    /**
     * Get the lists of slabs by type
     */
    exports.slabList = function (req, res) {

        /* TESTING LISTS */
        var apiSlabList = [
            { name: 'twitter api', id: 'twitter', type: 'api', in: 0, out: 3},
            { name: 'facebook', id: 'facebook', type: 'api', in: 0, out: 3}
        ];
        var staticDataList = [
            { name: 'argos sales', id: 'argos', type: 'static', in: 0, out: 3},
            { name: 'government spending', id: 'government', type: 'static', in: 0, out: 3}
        ];
        var processingSlabList = [
            { name: 'data smasher', id: 'data-smasher', type: 'processing', in: 3, out: 1},
            { name: 'correlator', id: 'correlator', type: 'processing', in: 3, out: 1}
        ];
        var outputSlabList = [
            { name: 'bar chart', id: 'bar', type: 'output', in: 1, out: 0},
            { name: 'pie chart', id: 'pie', type: 'output', in: 1, out: 0}
        ];

        var slabType = req.params.slabType;

        var slabList;

        switch (slabType) {
            case 'api' :
                slabList = apiSlabList;
                break;
            case 'static' :
                slabList = staticDataList;
                break;
            case 'processing' :
                slabList = processingSlabList;
                break;
            case 'output' :
                slabList = outputSlabList;
                break;
            default :
                res.status(400).send({
                    message: 'no slab type "' + slabType + '" found...'
                });
                return;
        }

        res.status(200);
        res.json(slabList);

    };


    /**
     * Get the input settings url for a particular slab
     */
    exports.settings = function (req, res) {

        var slabID = req.params.slabID;
        var slabType = req.params.slabType;

        var assetStr = './slab-files/' + slabType + '/' + slabID + '/input';

        var resp = {
            url: assetStr
        };

        res.status(200);
        res.json(resp);

    };

    return exports;

};

