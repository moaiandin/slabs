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
 * List of Api slabs
 */
var apiSlabList = [{name:'twitter', id:'0', type:'api'},{name:'facebook', id:'1', type:'api'}];
exports.apiList = function(req, res) {

    res.status(200);
    res.json(apiSlabList);

};

/**
 * List of Static Data slabs
 */
var staticDataList = [{name:'argos sales', id:'0', type:'static'},{name:'government spending', id:'1', type:'static'}];
exports.staticDataList = function(req, res) {

    res.status(200);
    res.json(staticDataList);

};

/**
 * List of Data Processing slabs
 */
var processingSlabList = [{name:'data smasher', id:'0', type:'processing'},{name:'correlator', id:'1', type:'processing'}];
exports.processingList = function(req, res) {

    res.status(200);
    res.json(processingSlabList);

};

/**
 * List of Output slabs
 */
var outputSlabList = [{name:'bar chart', id:'0', type:'output'},{name:'pie chart', id:'1', type:'output'}];
exports.outputList = function(req, res) {

    res.status(200);
    res.json(outputSlabList);

};

/**
 * Get the settings iframe for a particular slab
 */
exports.settings = function(req, res){

    var slabName = req.params.slabName;

    var pathStr = path.join(__dirname,'../slabs/'+slabName+'/'+slabName+'.html');

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
