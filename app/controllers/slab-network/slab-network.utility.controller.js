/* global require:true */
'use strict';

module.exports = function() {

    var exports = {};

    exports.execute = function (slabObj, dependencies, callback) {

        // todo - path to slabs dir should be hold in config package
        var slab = require('../../slabs/utility/' + slabObj.id + '/process/app.js');

        var input = dependencies.map(function (item) {
            return {
                result: item.result,
                labels: item.labels
            };
        });

        //console.log('sending to utility:', input);
        slab.process({settings: slabObj.settings || {}, data: input})
          .then(function (data) {
                slabObj.result = data.result;
                slabObj.labels = data.labels;

                //console.log(slabObj);

                callback();
          });
    };

    return exports;

};
