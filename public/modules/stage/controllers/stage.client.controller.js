/* global $:false */
'use strict';


angular.module('stage').controller('StageController', ['$scope','$state',

	function($scope, $state) {

		$state.go('stage.sidebar');

		$scope.slabs = [

		];

		$('.stage').droppable({

			drop: function( event, ui ) {

				var item 			= ui.helper[0];
				var slabID 		= item.getAttribute('data-slab-id');
				var slabType  = item.getAttribute('data-slab-type');
				var slabName  = item.getAttribute('data-slab-name');
				var left			= ui.position.left;
				var top				= ui.position.top;

				var slab = {
					id		:slabID,
					type	:slabType,
					name	:slabName,
					left	:left,
					top		:top
				};

				$scope.slabs.push(slab);
				$scope.$digest();

			}

		});


	}
]);
