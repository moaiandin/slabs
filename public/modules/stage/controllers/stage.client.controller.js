/* global $:false */
/* global settingsFrame:false */
/* global window:false */
/* global jsPlumb:false */
'use strict';

// todo - tests for this class.
// todo - use controllerAs syntax with a vm var.
// todo - move bindable members to the top : https://github.com/johnpapa/angularjs-styleguide#style-y033

angular.module('stage').controller('StageController', ['$scope','$state','SlabsServices','$sce',

	function($scope, $state, SlabsServices, $sce) {

		$state.go('stage.sidebar');

		// initialize the slabs array.
		$scope.slabs = [];

		$scope.settingsPageVisible = false;

		$scope.runSlabNetwork = function(){

			var networkObject = {
				title : 'sample network',
				slabs : $scope.slabs
			};

			console.log(networkObject);

			SlabsServices.network.save({}, networkObject,
				function(resp){
				  console.log('network success!!');
					console.log(resp);
			},function(resp){
					console.log('network fail...');
					console.log(resp);
			});
		};

		$scope.openSlabSettings = function(slab){

			SlabsServices.slab.get({slabType:slab.type, slabID:slab.id}, function(obj){

				if(obj.file){

					$scope.settingsPageVisible = true;

					// write the settings file to the settings iFrame
					var iFrame = settingsFrame.contentWindow;
					iFrame.document.open();
					iFrame.document.write(obj.file);
					iFrame.document.close();

				}else{
					console.log('error loading settings file');
				}

			});

		};

		$('.stage').droppable({

			drop: function( event, ui ) {

				console.log('dropped');

				var item 			= ui.helper[0];
				var slabID 		= item.getAttribute('data-slab-id');
				var slabType  = item.getAttribute('data-slab-type');
				var slabName  = item.getAttribute('data-slab-name');
				var left			= ui.position.left;
				var top				= ui.position.top - 50; // the 50 is the header

				if(!slabID || !slabName || !slabType  ){
					console.log('slab dropped from the stage.');
					return;
				}

				var slab = {
					id		:slabID,
					type	:slabType,
					name	:slabName,
					left	:left,
					top		:top
				};

				// add slab to slab network
				$scope.slabs.push(slab);
				$scope.$digest();


				jsPlumb.makeSource($('.source'), {
					anchor: 'Continuous'
				});
				jsPlumb.makeTarget($('.target'), {
					anchor: 'Continuous'
				});

				jsPlumb.draggable($('.panel'), {
					containment:'#stageContainer'
				});


			}

		});

		window.submitSlabData = function(data){
			$scope.settingsPageVisible = false;
			$scope.$digest();
		};


		jsPlumb.ready(function() {

			jsPlumb.setContainer($('#stageContainer'));

		});

	}

]);
