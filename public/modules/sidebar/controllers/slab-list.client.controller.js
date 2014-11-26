'use strict';

angular.module('sidebar').controller('SlabListController', ['$scope','SlabLists',

	function($scope, SlabLists) {

		$scope.slabList = SlabLists.api.query();

		$scope.typeChanged = function(id){
			$scope.slabList = SlabLists[id].query();
		};

	}

]);
