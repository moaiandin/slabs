/* global require:true */
'use strict';

exports.execute = function(slabObj, deps, callback){
    console.log(slabObj);
    var slab = require('../../slabs/source/'+slabObj.id+'/process/app.js');
    slab.getData(slabObj.settings || {}).then(function(data){
        slabObj.result = data;
        callback();
    });
};
