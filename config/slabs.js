'use strict';

var   express = require('express'),
      path = require('path'),
      cronServer = require('../app/controllers/cron.server.controller.js');


exports.addSlabsFiles = function(app){

  // serves up all the external slab files - for menus and outputs.
  app.use('/slab-files', express.static(path.resolve('./app/slabs/')));

};

exports.cronStart = function(){

  cronServer.runCron();

};
