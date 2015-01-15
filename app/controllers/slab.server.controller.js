'use strict';

// todo - the slabList function needs to scan the slabs.json file to return which slabs are available.

/**
 * Module dependencies.
 */
var mongoose     = require('mongoose'),
    _            = require('lodash'),
    swig         = require('swig'),
    path         = require('path'),
    fs           = require('fs'),
    util         = require('util'),
    errorHandler = require('./errors.server.controller'),
    redis        = require('redis'),
    slabsConfig  = require('../../slabs.json');


module.exports = function(redisClient) {

    var exports = {};

    // loops over the slabs folder file and returns lists of slabs by type
    function getSlabList(type){

        var folders = fs.readdirSync('app/slabs/'+type);

        var slabs = _.map(folders, function(name){

            try{
                var conf = require('../slabs/'+type+'/'+name+'/slabs-config.json');
                var slab = {
                    name: conf.name,
                    id: name,
                    type: type,
                    in : conf.connectionsIn,
                    out : conf.connectionsOut
                };
                return slab;
            }catch(err){
                console.log('Error reading slabs-config.json from :'+name+' in'+type);
                console.log(err);
            }

        });

        return slabs;

    }


    /**
     * Get the lists of slab types using the folder structure
     */
    exports.types = function (req, res) {

        var slabTypes = [];

        var folders = fs.readdirSync('app/slabs');

        slabTypes = _.map(folders, function(item){
                var slabType = {
                    id:item,
                    label:item
                };
                return slabType;
        });

        slabTypes = _.filter(slabTypes, function(item){
            return item.id !== 'ticker';
        });

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

