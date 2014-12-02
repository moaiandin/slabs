'use strict';

/**
 * Module dependencies.
 */
var mongoose    = require('mongoose'),
    _           = require('lodash'),
    swig        = require('swig'),
    path        = require('path'),
    errorHandler = require('./errors.server.controller');


/**
 * Get the lists of slab types
 */
exports.types = function(req, res){

    /* HARDCODED SLAB TYPES */
    var slabTypes = [
        { id:'api', label:'api\'s' },
        { id:'static', label:'static data' },
        { id:'processing', label:'data processors' },
        { id:'output', label:'data output' }
    ];

    res.status(200);
    res.json(slabTypes);
};


/**
 * Get the lists of slabs by type
 */
exports.slabList = function(req, res){

    /* TESTING LISTS */
    var apiSlabList = [{name:'twitter api', id:'twitter', type:'api'},{name:'facebook', id:'1', type:'api'}];
    var staticDataList = [{name:'argos sales', id:'0', type:'static'},{name:'government spending', id:'1', type:'static'}];
    var processingSlabList = [{name:'data smasher', id:'0', type:'processing'},{name:'correlator', id:'1', type:'processing'}];
    var outputSlabList = [{name:'bar chart', id:'bar', type:'output'},{name:'pie chart', id:'pie', type:'output'}];

    var slabType = req.params.slabType;

    var slabList;

    switch(slabType) {
        case 'api' :
            slabList = apiSlabList;
            break;
        case 'static' :
            slabList = staticDataList;
            break;
        case 'processing' :
            slabList = processingSlabList;
            break;
        case 'output' :
            slabList = outputSlabList;
            break;
        default :
          res.status(400).send({
              message: 'no slab type "'+slabType+'" found...'
          });
          return;
    }

    res.status(200);
    res.json(slabList);

};



/**
 * Get the settings iframe for a particular slab
 */
exports.settings = function(req, res){

    var slabID = req.params.slabID;
    var slabType = req.params.slabType;

    var pathStr = path.join(__dirname,'../slabs/'+slabType+'/'+slabID+'/input.html');

    var renderedFile;

    try {
        renderedFile = swig.renderFile(pathStr, {});
    }catch(err){
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    }

    if(renderedFile){

        var resp = {
            file : renderedFile
        };

        res.status(200);
        res.json(resp);
    }

};
