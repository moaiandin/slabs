/* global require:true */

'use strict';

/**
 * Module dependencies.
 */
var mongoose    = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    _           = require('lodash'),
    async       = require('async'),
    Q           = require('q'),
    SlabOutput  = mongoose.model('SlabOutput'),
    NetworkView = mongoose.model('NetworkView'),
    Network     = mongoose.model('Network');

module.exports = function() {

    var exports = {};


    // run function for individual slabs
    var run = function(slabObj, dependencies){

        var deferred = Q.defer();

        try{
            require('./slab-network/slab-network.' + slabObj.type + '.controller.js')
              .execute(slabObj, dependencies, deferred.resolve);
        }catch(err){
            slabObj.error = true;
            slabObj.result = err;
            deferred.resolve();
        }

        return deferred.promise;
    };


    var runSlab = function(item, callback, fullList){

        processSlabs(item.dependencies, fullList).then(function(fullList){

            var dependencies = item.dependencies.map(function(dependencyObject){
                return _.findWhere(fullList, {guid:dependencyObject.guid});
            });

            run(item, dependencies).then(function(){
                callback();
            });
        });

    };

    var processSlabs = function(ids, fullList){

        var deferred = Q.defer();

        // filters the fullList to only include the relevant IDs.
        var slabsToProcess = _.filter(fullList, function(item){
            return _.contains(ids, item.guid);
        });

        // this creates a promise loop
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

    var startNetworkRun = function(slabs ){

        var deferred = Q.defer();

        // get only the output slabs
        var outputSlabs = _.filter(slabs, function (item) {
            return item.type === 'output';
        });

        // returns an array of only the ids
        var outputIDs = _.pluck(outputSlabs, 'guid');

        processSlabs(outputIDs, slabs).then(function (runSlabsList) {

            var outputSlabs = _.where(runSlabsList, { type:'output' });

            // todo - move this into the network view controller
            var networkViewObject = {
                outputs : outputSlabs
            };
            var networkView = new NetworkView(networkViewObject);
            networkView.save(function(err, doc){

                deferred.resolve({
                    status: 'success',
                    viewId:doc._id
                });

            });

        });

        return deferred.promise;

    };


    /**
     * Create a Slab network
     */
    exports.create = function (req, res) {

        var slabs = req.body.slabs;
        var title = req.body.title;

        if (slabs.length > 0) {

            var networkObj = {
                title : title,
                slabs : slabs
            };

            // create a new network in the database
            var network = new Network(networkObj);
            network.save(function(err, doc){

                // run the network and return the result
                startNetworkRun(slabs).then(function(result){

                    console.log('in here');

                    res.status(200);
                    res.send(result);
                });

            });


        } else {
            res.status(400).send({
                message: 'invalid data sent - can\'t create slab network'
            });
        }

    };

    /**
     * Get data from an export slab and send to ato an dis
     */
    exports.getOutputData = function(req, res) {

        var outputId = req.params.outputid;
        SlabOutput.findById(outputId, function(err, doc){

            if(err){
                res.status(400).send({
                    message: 'invalid id sent - can\'t find a saved slab output'
                });
            }else{

                res.status(200);
                res.send(doc);

            }
        });

    };


    /**
     * Show the current Slab network
     */
    exports.read = function (req, res) {

        var networkId = req.params.networkId;

        Network.findById(networkId, function(err, doc){

            if(err){

                res.status(400).send({
                    message: 'invalid id sent - can\'t find a saved slab network'
                });

            }else{

                res.status(200);
                res.json(doc);

            }
        });

    };

    /**
     * Update a Slab network
     */
    exports.update = function (req, res) {

    };


    /**
     * Delete an Slab network
     */
    exports.delete = function (req, res) {

    };

    /**
     * List of Slab networks
     */
    exports.list = function (req, res) {

        Network.find().sort('-created').select('title created').limit(10).exec(function(err, networks) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.json(networks);
            }
        });

    };

    return exports;

};
