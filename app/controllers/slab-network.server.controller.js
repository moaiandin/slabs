/* global processSlabs:true */

'use strict';

/**
 * Module dependencies.
 */
var mongoose    = require('mongoose'),
    _           = require('lodash'),
    async       = require('async'),
    Q           = require('q'),
    redis       = require('redis');

var runSlab = function(item, callback, fullList){

    // run function for individual slabs
    var run = function(slabObj){

        console.log('runningSlab');
        console.dir(item);

        switch(slabObj.type) {

            case 'api' :
                var slab = require('../slabs/api/'+slabObj.id+'/process/app.js');
                slab.getData(slab.settings).then(function(data){
                    slabObj.result = data;
                    callback();
                });
                break;
            case 'static' :
                callback();
                break;
            case 'processing' :
                callback();
                break;
            case 'output' :

                // todo - save the data from the dependency to the database and
                // todo - provide an id to the .result property which is then passed
                // todo - to the output display page.



                callback();
                break;
        }

    };

    // run any dependency slabs before running this one - this works recursively.
    if(item.dependencies.length > 0){
        processSlabs(item.dependencies, fullList).then(function(){
            run(item);
        });
    }else{
        run(item);
    }


};

var processSlabs = function(ids, fullList){

    //console.log('processSlabs');

    var deferred = Q.defer();

    // filters the fullList to only include the relevant IDs.
    var slabsToProcess = _.filter(fullList, function(item){
        var rtn = _.contains(ids, item.guid);
        return rtn;
    });

    //console.dir(slabsToProcess);

    async.eachSeries(slabsToProcess, function(item, callback){
        runSlab(item, callback, fullList);
    }, function(err){
        // if any of the file processing produced an error, err would equal that error
        if( err ) {
            // One of the iterations produced an error.
            // All processing will now stop.
            console.log('A file failed to process');
            deferred.reject(err);
        } else {
            //console.log('All files have been processed successfully');
            deferred.resolve(fullList);
        }
    });

    return deferred.promise;

};



/**
 * Create a Slab network
 */
exports.create = function(req, res) {

    var title = req.body.title;
    var slabs = req.body.slabs;

    if(slabs.length > 0){

        // get only the output slabs
        var outputSlabs = _.filter(slabs, function(item){ return item.type === 'output'; });

        // returns an array of only the ids
        var outputIDs   =_.pluck(outputSlabs, 'guid');

        processSlabs(outputIDs, slabs).then(function(runSlabsList){

            console.log('runSlabsList');
            console.dir(runSlabsList);
            res.status(200);
            res.send({status:'success'});

        });

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
