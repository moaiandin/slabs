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
    Network     = mongoose.model('Network');

module.exports = function() {

    var exports = {};


    // run function for individual slabs
    var run = function(slabObj, dependencies, networkObject){

        var deferred = Q.defer();

        try{

            var controller = require('./slab-network/slab-network.' + slabObj.type + '.controller.js')();
            controller.execute(slabObj, dependencies, deferred.resolve, networkObject);

        }catch(err){

            console.error('run failed');
            console.error(err);

            slabObj.error = true;
            slabObj.result = err;
            deferred.resolve();
        }

        return deferred.promise;
    };


    var runSlab = function(item, callback, fullList, networkObject){

        var depIDs = _.pluck(item.dependencies, 'guid');

        processSlabs(depIDs, fullList, networkObject).then(function(fullList){

            var dependencies = item.dependencies.map(function(dependencyObject){
                return _.findWhere(fullList, {guid:dependencyObject.guid});
            });

            run(item, dependencies, networkObject).then(function(){
                callback();
            });
        });

    };

    var processSlabs = function(ids, fullList, networkObject){

        var deferred = Q.defer();

        // filters the fullList to only include the relevant IDs.
        var slabsToProcess = _.filter(fullList, function(item){
            return _.contains(ids, item.guid);
        });

        // this creates a promise loop
        async.eachSeries(slabsToProcess, function(item, callback){
            runSlab(item, callback, fullList, networkObject);
        }, function(err){
            // if any of the file processing produced an error, err would equal that error
            if( err ) {
                // One of the iterations produced an error.
                // All processing will now stop.
                //console.log('A file failed to process');
                deferred.reject(err);
            } else {
                ////console.log('All files have been processed successfully');
                deferred.resolve(fullList);
            }
        });

        return deferred.promise;

    };

    var startNetworkRun = function(slabs, networkObject){

        var deferred = Q.defer();
        var networkID = networkObject._id;

        // get only the output slabs
        var outputSlabs = _.filter(slabs, function (item) {
            return item.type === 'output';
        });

        // returns an array of only the ids
        var outputIDs = _.pluck(outputSlabs, 'guid');

        processSlabs(outputIDs, slabs, networkObject).then(function (runSlabsList) {

            var outputSlabs = _.where(runSlabsList, { type:'output' });

            var runTime = new Date();
            runTime = runTime.valueOf();
            var updateObj = {
                lastRun:runTime,
                outputs : outputSlabs
            };

            // update the network with the new outputs & run time.
            Network.update({_id:networkID}, updateObj, null, function(err, networkDoc){

                deferred.resolve();

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

        var tickerInterval = Number(slabs[0].settings.tickInterval) * 60000;

        if (slabs.length > 0) {

            var networkObj = {
                title : title,
                slabs : slabs,
                tickerInterval : tickerInterval
            };

            // create a new network in the database
            var network = new Network(networkObj);
            network.save(function(err, doc){

                if(err) {
                    //console.log(err);
                }

                var networkID = doc._id;

                // run the network and return the result
                startNetworkRun(slabs, doc).then(function(){

                    res.status(200);
                    res.send( { status: 'success', networkID : networkID});
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

        var slabs       = req.body.slabs;
        var title       = req.body.title;
        var networkID   = req.body.id;
        var tickerInterval = Number(slabs[0].settings.tickInterval) * 60000;

        if (slabs.length > 0) {

            var networkObj = {
                title : title,
                slabs : slabs,
                tickerInterval : tickerInterval
            };

            Network.findById(networkID, function(err, doc){

                if(err) //console.log(err);

                doc.update(networkObj, null, function(err, numberAffected, raw) {

                    if(err) //console.log(err);

                    // run the network and return the result
                    startNetworkRun(slabs, doc).then(function(){
                        res.status(200);
                        res.send( { status: 'success', networkID : networkID});

                    });

                });

            });


        } else {
            res.status(400).send({
                message: 'invalid data sent - can\'t create slab network'
            });
        }

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

        Network.find().sort('-created').select('title created _id').limit(10).exec(function(err, networks) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.json(networks);
            }
        });

    };


    /**
     * Run a Slab network
     */
    exports.run = function (networkObj) {

        // run the network and return the result
        startNetworkRun(networkObj.slabs, networkObj).then(function(result){

            //console.log('network run from cron');
            //console.log(result);

        });

    };

    /**
     * Show the current Slab network view
     */
    exports.createView = function (req, res) {

        var networkId = req.params.networkID;

        Network.findById(networkId, function (err, doc) {

            if (err) {

                res.status(400).send({
                    message: 'invalid id sent - can\'t find a saved slab network'
                });

            } else {

                res.status(200);

                if(!doc){
                    console.error('Network not found.');
                    return;
                }

                ////console.log(doc.outputs);
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

    return exports;

};
