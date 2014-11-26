'use strict';

angular.module('sidebar').factory('SlabLists', ['$resource',
	function($resource) {

		// Apicomponents service logic

		// Public API
		return {
			api 			: $resource('api-slabs/'),
			static 		: $resource('static-data-slabs/'),
			processor : $resource('data-processor-slabs/'),
			output 		: $resource('output-slabs/')
		};
	}
]);
