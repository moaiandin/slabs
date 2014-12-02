'use strict';

angular.module('sidebar').directive('slabTypeSelector', ['SlabsServices',
	function(SlabsServices) {
		return {
			templateUrl: '/modules/sidebar/views/slab-type-selector.client.view.html',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {

				scope.types = SlabsServices.slabTypes.query();

				scope.buttonClicked = function(slabTypeID){
					scope.typeChanged({slabTypeID:slabTypeID});
				};

			},
			scope : {
				typeChanged:'&'
			}
		};
	}
]);
