'use strict';

//Setting up route
angular.module('stage').config(['$stateProvider',
	function($stateProvider) {
		// Stage state routing
		$stateProvider
			.state('stage', {
				url: '/stage/:networkID',
				templateUrl: 'modules/stage/views/stage.client.view.html'
			})
			.state('stage.sidebar', {
				templateUrl:'modules/sidebar/views/slab-list.client.view.html'
			});
	}
]);
