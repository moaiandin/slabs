'use strict';

angular.module('sidebar').factory('ApiSlabs', ['$resource',
	function($resource) {

		// Apicomponents service logic

		// Public API
		return $resource('api-slabs/');
	}
]);
