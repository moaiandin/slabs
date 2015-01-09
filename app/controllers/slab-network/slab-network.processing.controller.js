/* global require:true */
'use strict';

exports.execute = function(slabObj, dependencies, callback){
    var slab = require('../../slabs/processing/'+slabObj.id+'/process/app.js');
    
    var input = dependencies.map(function(item){
        return item.result;
    });

    console.log('input:', input);
    slab.process({settings: slabObj.settings || {}, data: input})
        .then(function(data){
            slabObj.result = data;
            callback();
        });
};
