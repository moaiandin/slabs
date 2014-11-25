'use strict';

angular.module('sidebar').directive('sidebar', [
	function() {
		return {
			templateUrl: '/modules/sidebar/views/sidebar.html',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
				// Sidebar directive logic
				// ...

				//element.text('this is the sidebar directive');
			}
		};
	}
]);
