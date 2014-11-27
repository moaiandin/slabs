/* global $:false */
'use strict';

angular.module('sidebar').controller('SlabListController', ['$scope','SlabLists','$timeout',

	function($scope, SlabLists, $timeout) {

		$scope.typeChanged = function(id){
			$scope.slabList = SlabLists[id].query();
		};

		$scope.$watch('slabList', function(){
			$timeout(function(){
				$('.slab-item').draggable({helper:'clone'});
			},100);
		});

		$scope.slabList = SlabLists.api.query();

	}

]);
