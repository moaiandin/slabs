/* global require:true */

'use strict';

/**
 * Module dependencies.
 */
var mongoose    = require('mongoose'),
    _           = require('lodash'),
    async       = require('async'),
    Q           = require('q'),
    SlabOutput  = mongoose.model('SlabOutput'),
    NetworkView = mongoose.model('NetworkView');

module.exports = function() {

    var exports = {};

    var runSlab = function(item, callback, fullList){

        processSlabs(item.dependencies, fullList).then(function(){

            var dependencies = item.dependencies.map(function(guid){
                return _.findWhere(fullList, {guid:guid});
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


    /**
     * Create a Slab network
     */
    exports.create = function (req, res) {

        var slabs = req.body.slabs;

        if (slabs.length > 0) {

            // get only the output slabs
            var outputSlabs = _.filter(slabs, function (item) {
                return item.type === 'output';
            });

            // returns an array of only the ids
            var outputIDs = _.pluck(outputSlabs, 'guid');

            processSlabs(outputIDs, slabs).then(function (runSlabsList) {

                var outputSlabs = _.where(runSlabsList, { type:'output' });

                var networkViewObject = {
                    outputs : outputSlabs
                };
                var networkView = new NetworkView(networkViewObject);
                networkView.save(function(err, doc){
                    res.status(200);
                    res.send({
                        status: 'success',
                        viewId:doc._id
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

        var networkId = req.params.networkViewID;
        NetworkView.findById(networkId, function(err, doc){

            if(err){

                res.status(400).send({
                    message: 'invalid id sent - can\'t find a saved slab network view'
                });

            }else{

                res.status(200);

                console.log(doc.outputs);
                var urlRoot = req.protocol + '://' + req.get('host');

                // set the view settings
                var isOdd = doc.outputs.length % 2 !== 0;
                var settings = {
                    isOdd : isOdd
                };

                var options = { root:urlRoot, outputs:doc.outputs, settings:settings };
                res.render('default-view', options);

            }
        });


        return;



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

    };

    return exports;

};
