/* global $:false */
/* global settingsFrame:false */
/* global window:false */
'use strict';

// todo - tests for this class.
// todo - use controllerAs syntax with a vm var.
// todo - move bindable members to the top : https://github.com/johnpapa/angularjs-styleguide#style-y033

angular.module('stage').controller('StageController', ['$scope','$state','Slabsettings','$sce',

	function($scope, $state, Slabsettings, $sce) {

		$state.go('stage.sidebar');

		// initialize the slabs array.
		$scope.slabs = [];

		$scope.settingsPageVisible = false;

		// todo - make a call to the server posting the current slab setup
		$scope.runSlabNetwork = function(){
			console.log('run slab network');
		};

		$scope.openSlabSettings = function(slab){

			Slabsettings.get({slabName:slab.name}, function(obj){

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

		window.submitSlabData = function(data){
			$scope.settingsPageVisible = false;
			$scope.$digest();
		};

	}

]);
