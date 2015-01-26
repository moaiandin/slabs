'use strict';

angular.module('stage').factory('SlabsServices', ['$resource',
	function($resource) {

		// Public API
		return {
			network			 					: $resource('/network/', null, {
				'update': { method:'PUT' }
			}),
			getNetwork	 					: $resource('/network/:networkID'),
			upVoteNetwork					: $resource('/network/upvote/:networkId'),
			getNetworksByVotes    : $resource('/network/byupvote/'),
			slabTypes		 					: $resource('/slab/types'),
			slab 				 					: $resource('/slab/:slabType/:slabID'),
			slabList 		 					: $resource('/slab/:slabType')
		};


	}
]);
