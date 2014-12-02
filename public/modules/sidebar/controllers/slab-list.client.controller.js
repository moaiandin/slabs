/* global $:false */
'use strict';

// todo - tests for this class
// todo - use controllerAs syntax with a vm var.
// todo - move bindable members to the top : https://github.com/johnpapa/angularjs-styleguide#style-y033

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
