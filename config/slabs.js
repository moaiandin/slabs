'use strict';

var   express = require('express'),
      path = require('path');


// todo - get this to work so that we can serve all the front end folders of each slab.
// todo - this allows external js files and full external modules to be used for front end slabs.
// todo - this may not be needed for forms but will definitely be needed for charts
exports.addSlabsFiles = function(app){

  app.use('/slab-files', express.static(path.resolve('./app/slabs/')));

};
