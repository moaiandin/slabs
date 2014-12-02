'use strict';


/**
 * getData - passes in the config object from the client
 */
exports.getData = function(req, res) {

    var configObj = req.params.config;

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

    res.json(sampleData);

};
