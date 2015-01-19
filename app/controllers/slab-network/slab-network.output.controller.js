/* global require:true */

'use strict';

var mongoose    = require('mongoose'),
    _           = require('lodash'),
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

    exports.execute = function (slabObj, dependencies, callback, networkObject) {

        // todo - the data here needs to be added to so a trend can be seen,
        // todo - and not overwritten. -- the save needs to be an update so
        // todo - that data can be added to the output.

        SlabOutput.findOne({guid:slabObj.guid}, function(err, output){

            // an output is only allowed one dependency
            var dependencyData = dependencies[0];
            var categories;
            var data;

            if(output){

                output.categories.push(new Date());
                categories = output.categories;

                output.data.push(dependencyData.result);
                data = output.data;

            }else{
                categories = [new Date()];
                data = [dependencyData.result];
            }


            var outputDependencyData = {
                categories      : categories,
                settings        : slabObj.settings,
                guid            : slabObj.guid,
                data            : data,
                labels          : dependencyData.labels,
                values          : getValues(dependencyData.result)
            };


            SlabOutput.findOneAndUpdate({guid:slabObj.guid}, outputDependencyData, { upsert: true }, function (err, doc) {

                if (err) return console.log(err);

                slabObj.result = '/slab-files/output/' + slabObj.id + '/output/?id=' + doc._id;
                callback();

            });

        });


    };

    return exports;

};
