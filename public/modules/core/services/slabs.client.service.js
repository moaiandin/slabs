'use strict';

angular.module('stage').factory('SlabsServices', ['$resource',
	function($resource) {

		// Public API
		return {
			network			 : $resource('/networkview/'),
			slabTypes		 : $resource('/slab/types'),
			slab 				 : $resource('/slab/:slabType/:slabID'),
			slabList 		 : $resource('/slab/:slabType')
		};

	}
]);
