'use strict';

angular.module('sidebar').directive('slabTypeSelector', ['Slabtypes',
	function(Slabtypes) {
		return {
			templateUrl: '/modules/sidebar/views/slab-type-selector.client.view.html',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {

				scope.types = Slabtypes.getSlabTypes();

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
