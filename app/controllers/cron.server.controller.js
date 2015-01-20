'use strict';

var CronJob     = require('cron').CronJob,
    mongoose    = require('mongoose');


exports.runCron = function(){

  // declare this here to avoid errors.
  var Network     = mongoose.model('Network');
  var slabNetworkController = require('./slabNetwork.server.controller.js')();

  new CronJob('*/5 * * * * *', function(){

    //console.log('You will see this message every 5 seconds');

    var now = new Date();
    now = now.valueOf();

    Network.collection.find ({}, {}, function (error, cursor){

      cursor.each (function (error, doc){

        if(doc && doc.lastRun){

          if(now > doc.lastRun + doc.tickerInterval){
            // run network
            slabNetworkController.run(doc);
          }
          //console.log(doc.lastRun);
        }
      });

    });


  }, null, true);

};
