'use strict';

module.exports = function() {

    var exports = {};

    /*
    function formatData(slab){

        // add uuid to data
        var formattedData = {};
        var formattedLabels = {};
        for(var prop in slab.result){

            var uuid = Math.floor ( Math.random() * 10000000000 );

            formattedData[prop+'_'+uuid] = slab.result[prop];
            formattedLabels[prop+'_'+uuid] = slab.labels[prop];
        }
        slab.result = formattedData;
        slab.labels = formattedLabels;

    }
    */

    function getLabels(slab, data, settings){

        var labels = {};

        for(var prop in data){
            if(slab.getLabel) {
                labels[prop] = slab.getLabel(prop, settings);
            }else{
                labels[prop] = prop;
            }
        }

        return labels;

    }


    exports.execute = function (slabObj, deps, callback, networkObject) {

        // todo - this may not be the most robust solution
        // result already exists - no need to re-run slab
        // this matters because some source slabs will give different results
        // if run twice in quick succession
        if(slabObj.result !== undefined){
            callback();
            return;
        }

        var slab = require('../../slabs/source/' + slabObj.id + '/process/app.js');

        slab.getData(slabObj.settings || {}, networkObject._id).then(function (data) {

            //console.log('running source [' + slabObj.id + '] in [' + networkObject._id + ']');

            slabObj.labels = getLabels(slab, data, slabObj.settings);
            slabObj.result = data;
            //formatData(slabObj);

            //console.log('source data : ');
            //console.log(data);
            callback();
        });
    };

    return exports;

};


