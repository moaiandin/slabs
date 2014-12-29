[![Build Status](https://api.shippable.com/projects/54774d48d46935d5fbbecc12/badge?branchName=master)](https://app.shippable.com/projects/54774d48d46935d5fbbecc12/builds/latest)

Slabs.io is a data experimentation platform. It enables drag & drop functionality for pulling, processing and then displaying the data. Slabs is an open-source project - you can submit pull requests for the main git repo.

The power of slabs comes from the external modules it consumes. These are submitted by users and then available for anyone to use in their own slab networks. There are 3 main types of slab, 'sources', 'processors' and 'outputs'.

##
How it works

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



##
Setup :
```
npm install
```
This will pull all your NPM modules, bower modules and all the external slabs listed in slabs.json.


##
Running : 
```
grunt
```
And then navigate to http://localhost:3000/ in your browser.
