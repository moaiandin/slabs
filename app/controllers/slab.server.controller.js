'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash');



/**
 * List of Api slabs
 */
var apiSlabList = [{name:'twitter'},{name:'facebook'}];
exports.apiList = function(req, res) {

    res.status(200);
    res.json(apiSlabList);

};

/**
 * List of Static Data slabs
 */
var staticDataList = [{name:'argos sales'},{name:'government spending'}];
exports.staticDataList = function(req, res) {

    res.status(200);
    res.json(staticDataList);

};

/**
 * List of Data Processing slabs
 */
var processingSlabList = [{name:'data smasher'},{name:'correlator'}];
exports.processingList = function(req, res) {

    res.status(200);
    res.json(processingSlabList);

};

/**
 * List of Output slabs
 */
var outputSlabList = [{name:'bar chart'},{name:'pie chart'}];
exports.outputList = function(req, res) {

    res.status(200);
    res.json(outputSlabList);

};
