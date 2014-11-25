'use strict';

angular.module('stage').directive('slab', [
	function() {
		return {
			template: '<div></div>',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
				// Slab directive logic
				// ...

				element.text('this is the slab directive');
			}
		};
	}
]);