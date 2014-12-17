[![Build Status](https://api.shippable.com/projects/54774d48d46935d5fbbecc12/badge?branchName=master)](https://app.shippable.com/projects/54774d48d46935d5fbbecc12/builds/latest)

Slabs.io is a data experimentation platform. 

It enables drag & drop functionality for creating, processing and then displaying data.

Slabs is an open-source project - you can submit pull requests for the main git repo.

The power of slabs however comes from the external modules it consumes. These are submitted by users and then available for anyone to use in their own slab networks. There are 3 main types of slab, 'sources', 'processors' and 'outputs'.

The spec for the input & output of slab objects currently looks like this :


 ```javascript
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
 ```

During initial development this spec is likely to change frequently.
