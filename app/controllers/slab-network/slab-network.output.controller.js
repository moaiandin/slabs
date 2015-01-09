/* global require:true */

'use strict';

var mongoose    = require('mongoose'),
    SlabOutput  = mongoose.model('SlabOutput');

exports.execute = function(slabObj, dependencies, callback) {
    var dependencyData = dependencies[0];

    var outputDependencyData = {
        settings: slabObj.settings,
        data: dependencyData.result
    };

    var outputData = new SlabOutput(outputDependencyData);
    outputData.save(function (err, doc){

        if (err){
            throw err;
        }

        // create a url from the slab data and the id of the saved dependency data
        slabObj.result = '/slab-files/output/' + slabObj.id + '/output/?id=' + doc._id;
        callback();
    });

};
