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
				guid:'=',
				type:'=',
				name:'=',
				left:'=',
				top:'=',
				in:'=',
				out:'=',
				openSettings:'&'
			}
		};
	}
]);
