'use strict';

angular.module('sidebar').factory('SlabLists', ['$resource',
	function($resource) {

		// Apicomponents service logic

		// Public API
		return {
			api 			: $resource('api-slabs/'),
			static 		: $resource('api-slabs/'),
			processor : $resource('api-slabs/'),
			output 		: $resource('api-slabs/')
		};
	}
]);
