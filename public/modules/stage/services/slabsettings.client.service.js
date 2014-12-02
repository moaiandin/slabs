'use strict';

angular.module('stage').factory('Slabsettings', ['$resource',
	function($resource) {

		// Public API
		return $resource('/slab/:slabName');
	}
]);
