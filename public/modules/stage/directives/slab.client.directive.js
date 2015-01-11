'use strict';

angular.module('stage').directive('slab', [
	function() {
		return {
			templateUrl: '/modules/stage/views/slab.client.view.html',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {

				scope.bootstrapClass = 'info';
				scope.iconClass = 'glyphicon-save';

				if(scope.type === 'output'){
					scope.iconClass = 'glyphicon-stats';
					scope.bootstrapClass = 'success';
				}
				if(scope.type === 'processing'){
					scope.iconClass = 'glyphicon-cog';
					scope.bootstrapClass = 'warning';
				}

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
				openSettings:'&',
				removeClicked:'&'
			}
		};
	}
]);
