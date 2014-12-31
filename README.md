[![Build Status](https://api.shippable.com/projects/54774d48d46935d5fbbecc12/badge?branchName=master)](https://app.shippable.com/projects/54774d48d46935d5fbbecc12/builds/latest)
# Slabs.io

Slabs.io is a data experimentation platform. It enables drag & drop functionality for pulling, processing and then displaying the data. In slabs the user arranges a network of slabs on the page, the network can then be run and some form of output is generated.

## How it works

The power of slabs comes from the external modules it consumes. These are submitted by users and then available for anyone to use in their own slab networks. There are 3 main types of slab, 'sources', 'processors' and 'outputs'.

### Sources
Sources provide data to the slab network, the user sets some parameters for the data source then the source slab goes out, grabs the data and passes it to the next slab(s) in the network. The sample slab source can be found <a href="https://github.com/slabs-io/api-slab-demo">here</a>.

### Processors
Processing slabs cover any slab that doesn't get data from a server, or display it. These can included things like combination, splitting, sorting and converting of data.

### Outputs
Outputs are how the data, which is gathered and processed in the network, is seen. This can be in the form of a chart, table or any other way that data can be consumed. Data is passed into the output slab and then displayed using the settings the user has provided for that output slab. The sample slab output can be found <a href="https://github.com/slabs-io/output-slab-demo">here</a>.

### Communication between slabs

The spec for the input & output of slab objects currently looks like this, however during initial development this spec is likely to change frequently. :

 ```javascript
var sampleData = {

	dateFrom    : '1416654884000',
	dateTo      : '1417000484000',
	categories  : ['date'],
	series      : ['tweets', 'mentions'],
	data        : [
		{date : '21/11/2014', tweets: '15', mentions:'23'},
		{date : '22/11/2014', tweets: '10', mentions:'13'},
		{date : '23/11/2014', tweets: '8', mentions:'12'},
		{date : '24/11/2014', tweets: '25', mentions:'34'},
		{date : '25/11/2014', tweets: '18', mentions:'21'},
		{date : '26/11/2014', tweets: '4', mentions:'6'}
	]

};
 ```

## Help
You can get help on the <a href="http://chat.slabs.io/">slabs forum</a>, or on the slabs IRC channel (#slabsio on freenode.net), we are all pretty friendly so come stop by!!

## Install
```shell
npm install
```
This will pull all your NPM modules, bower modules and all the external slabs listed in slabs.json.

## To run slabs locally
```shell
grunt
```
And then navigate to http://localhost:3000/ in your browser.

## Development
The project uses MEANJS, so to add modules on the front or the backend you can use yeoman commands. More info can be found <a href="http://meanjs.org/generator.html">here</a>.

On the front end please try and follow the <a href="https://github.com/johnpapa/angularjs-styleguide">john-papa angular style guide</a>

### Dev Notes : 

#### Front end libraries
When adding front end libraries (including by bower), don't forget that you need to edit the config files which pull in the files. These are found here :
```
/config/env/all.js
/config/env/production.js
/config/env/secure.js
```
You need to add the locations of the js files to the `assets.lib.js` property.

