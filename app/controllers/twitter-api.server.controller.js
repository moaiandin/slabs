'use strict';

/**
 * Module dependencies.
 */
var mongoose        = require('mongoose');
var _               = require('lodash');
var Twitter         = require('mtwitter');
var errorHandler    = require('./errors.server.controller');

/**
 * getData - passes in the config object from the client
 */
exports.getData = function(req, res) {

    var configObj = req.params.config;

    var config = {
        key     : 'MiPIZhAw9TGfODBQgqIKEyJ9D',
        secret  : 'WBHqsk5JpWPuQxykjeVNFHUp2AB0QYr9WAlxyhhH0e2gbbHWj2'
    };

    var twitter = new Twitter({
        consumer_key: config.key,
        consumer_secret: config.secret,
        application_only: true
    });

    var sampleData = {

        dateFrom    : '1416654884000',
        dateTo      : '1417000484000',
        categories  : ['date'],
        series      : ['tweets'],
        data        : [
            {date : '21/11/2014', tweets: '15'},
            {date : '22/11/2014', tweets: '10'},
            {date : '23/11/2014', tweets: '8'},
            {date : '24/11/2014', tweets: '25'},
            {date : '25/11/2014', tweets: '18'},
            {date : '26/11/2014', tweets: '4'}
        ]

    };

    twitter.get('search/tweets', {q: 'elliot'}, function(err, item) {

        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(sampleData);
        }

    });

};
