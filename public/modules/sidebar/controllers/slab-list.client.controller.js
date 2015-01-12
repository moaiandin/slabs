/* global $:false */
'use strict';

// todo - tests for this class

angular.module('sidebar').controller('SlabListController', ['$scope','SlabsServices','$timeout',

	function($scope, SlabsServices, $timeout) {

		var vm = this;
		vm.typeChanged = typeChanged;
		vm.slabList = SlabsServices.slabList.query({slabType:'source'});

		////////////

		function init(){

			// watch for changes to the slab list
			$scope.$watch(function () {
				return vm.slabList;
			}, makeSlabsDraggable);

			// initialize the 'draggability of slabs in the list'
			makeSlabsDraggable();

		}

		function typeChanged(id){
			console.log('typeChanged');
			vm.slabList = SlabsServices.slabList.query({slabType:id});
		}

		function makeSlabsDraggable(){

			console.log(' _ _ making draggable');

			var run = function(){
				console.log(' _ making draggable');
				console.log($('.slab-list').children());
				$('.slab-list .slab-item').draggable({helper:'clone'});
			};

			$timeout(run, 400);

		}

		init();

	}

]);
