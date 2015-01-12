'use strict';

angular.module('stage').directive('slab', [
	function() {
		return {
			templateUrl: '/modules/stage/views/slab.client.view.html',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {

				scope.hideDelete = scope.type === 'scheduler';

				scope.bootstrapClass = 'default';
				scope.iconClass = 'glyphicon-time';

				if(scope.type === 'source'){
					scope.iconClass = 'glyphicon-save';
					scope.bootstrapClass = 'info';
				}

				if(scope.type === 'output'){
					scope.iconClass = 'glyphicon-stats';
					scope.bootstrapClass = 'success';
				}
				if(scope.type === 'utility'){
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
