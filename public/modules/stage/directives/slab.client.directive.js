'use strict';

angular.module('stage').directive('slab', [
	function() {
		return {
			templateUrl: '/modules/stage/views/slab.client.view.html',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {

			},
			scope: {
				id:'=',
				type:'=',
				name:'=',
				left:'=',
				top:'=',
				openSettings:'&'
			}
		};
	}
]);
