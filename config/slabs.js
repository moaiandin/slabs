'use strict';

var   express = require('express'),
      path = require('path');


exports.addSlabsFiles = function(app){

  // serves up all the external slab files - for menus and outputs.
  app.use('/slab-files', express.static(path.resolve('./app/slabs/')));

};
