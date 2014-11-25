'use strict';

//Setting up route
angular.module('stage').config(['$stateProvider',
	function($stateProvider) {
		// Stage state routing
		$stateProvider
			.state('stage', {
				url: '/stage',
				templateUrl: 'modules/stage/views/stage.client.view.html'
			})
			.state('stage.api-components', {
				templateUrl:'modules/sidebar/views/api-list.client.view.html'
			});
	}
]);
