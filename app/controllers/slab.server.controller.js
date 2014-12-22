'use strict';

// todo - the slabList function needs to scan the slabs.json file to return which slabs are available.

/**
 * Module dependencies.
 */
var mongoose     = require('mongoose'),
    _            = require('lodash'),
    swig         = require('swig'),
    path         = require('path'),
    errorHandler = require('./errors.server.controller'),
    redis        = require('redis'),
    slabsConfig  = require('../../slabs.json');


module.exports = function(redisClient) {

    var exports = {};

    // loops over the slabs.json file and returns lists of slabs by type
    function getSlabList(type){

        var slabs = [];

        var slabList = slabsConfig.app.slabs;

        for(var prop in slabList){

            if(prop === type){

                for(var slabID in slabList[prop]){

                    try{
                        var conf = require('../slabs/'+type+'/'+slabID+'/slabs-config.json');
                        var slab = {
                            name: conf.name,
                            id: slabID,
                            type: conf.type,
                            in : conf.connectionsIn,
                            out : conf.connectionsOut
                        };
                        slabs.push(slab);
                    }catch(err){
                        console.log('Error reading slabs-config.json from :'+slabID+' in'+type);
                        console.log(err);
                    }

                }

            }

        }

        return slabs;

    }

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

        var slabType = req.params.slabType;
        var slabList = getSlabList(slabType);
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

