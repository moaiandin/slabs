/* global require:true */

'use strict';

var mongoose    = require('mongoose'),
    SlabOutput  = mongoose.model('SlabOutput');


function getValues(object){
    var values = [];
    for(var prop in object){
        values.push(prop);
    }
    return values;
}


module.exports = function() {

    var exports = {};

    exports.execute = function (slabObj, dependencies, callback) {

        // todo - the data here needs to be added to so a trend can be seen,
        // and not overwritten.


        // an output is only allowed
        var dependencyData = dependencies[0];

        var outputDependencyData = {
            categories: [new Date()],
            settings: slabObj.settings,
            data: [dependencyData.result],
            labels: dependencyData.labels,
            values: getValues(dependencyData.result)
        };


        var outputData = new SlabOutput(outputDependencyData);
        outputData.save(function (err, doc) {

            if (err) {
                throw err;
            }

            // create a url from the slab data and the id of the saved dependency data
            slabObj.result = '/slab-files/output/' + slabObj.id + '/output/?id=' + doc._id;
            callback();
        });

    };

    return exports;

}
