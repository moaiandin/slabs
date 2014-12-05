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
    var apiSlabList = [{name:'twitter api', id:'twitter-api', type:'api', in:0, out:3 },{name:'facebook', id:'facebook', type:'api', in:0, out:3 }];
    var staticDataList = [{name:'argos sales', id:'argos', type:'static', in:0, out:3 },{name:'government spending', id:'government', type:'static', in:0, out:3 }];
    var processingSlabList = [{name:'data smasher', id:'data-smasher', type:'processing', in:3, out:3 },{name:'correlator', id:'correlator', type:'processing', in:3, out:3 }];
    var outputSlabList = [{name:'bar chart', id:'bar-chart', type:'output', in:3, out:0 },{name:'pie chart', id:'pie-chart', type:'output', in:3, out:0 }];

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
