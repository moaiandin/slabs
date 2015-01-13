'use strict';

angular.module('stage').factory('SlabsServices', ['$resource',
	function($resource) {

		// Public API
		return {
			network			 : $resource('/network/'),
			getNetwork	 : $resource('/network/:networkID'),
			slabTypes		 : $resource('/slab/types'),
			slab 				 : $resource('/slab/:slabType/:slabID'),
			slabList 		 : $resource('/slab/:slabType')
		};

	}
]);
