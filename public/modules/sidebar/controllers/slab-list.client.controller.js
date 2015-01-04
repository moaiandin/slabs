/* global $:false */
'use strict';

// todo - tests for this class
// todo - use controllerAs syntax with a vm var.
// todo - move bindable members to the top : https://github.com/johnpapa/angularjs-styleguide#style-y033

angular.module('sidebar').controller('SlabListController', ['$scope','SlabsServices','$timeout',

	function($scope, SlabsServices, $timeout) {

		$scope.typeChanged = function(id){
			$scope.slabList = SlabsServices.slabList.query({slabType:id});
		};

		$scope.$watch('slabList', function(){
			console.log('item changed');
			$timeout(function(){
				console.log('making draggable');
				$('.slab-item').draggable({helper:'clone'});
			},500);
		});


		$scope.slabList = SlabsServices.slabList.query({slabType:'api'});


	}

]);
