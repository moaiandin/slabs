/* global Highcharts:true */
'use strict';

// standard on jQuery ready function
$(document).ready(function(){

  // grab the id from the URL.
  var id = getUrlParameter('id');

  // use the id to request the data for the output slab.
  $.ajax({
    type : 'GET',
    url: '/getdata/'+id
  }).done(function(obj) {
    displayChart(obj);
  });

});

// display the chart
function displayChart (obj) {

  // this are the data sent back from the server.
  var title           = obj.title;
  var dateCreated     = obj.created;
  var settingsObj     = obj.settings; // this is the object that is saved from the input page
  var chartData       = obj.data; // this is the slabs 'output' object

  // slabs output object
  var categories      = chartData.categories;
  var series          = chartData.series;
  var data            = chartData.data;
  var dateFrom        = chartData.dateFrom;
  var dateTo          = chartData.dateTo;


  // set the page title
  window.document.title = title;

  // get an array of all the series values for highcharts
  var chartSeriesArray = [];
  _.each(chartData.data, function(item){

    // this is just the way highcharts accepts data.
    var datum = [item[categories[0]], Number(item[series[0]]) ];
    chartSeriesArray.push(datum);
  });

  console.log(chartSeriesArray);

  $('#chart-container').highcharts({
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: 1,//null,
      plotShadow: false
    },
    title: {
      text: title
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          style: {
            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
          }
        }
      }
    },
    series: [{
      type: 'pie',
      name: series[0],
      data: chartSeriesArray
    }]
  });

}


// utility function to grab the parameters from the URL
function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++)
  {
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] === sParam)
    {
      return sParameterName[1];
    }
  }
}
