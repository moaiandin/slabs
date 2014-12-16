'use strict';

// todo - submitSlabData needs to save the settings to the slab object.
// todo - validate slab network before submitting.
// todo - show a window with the output links on it.
// todo - handle errors when creating a slab network.
// todo - tests for this class.

angular.module('stage').controller('StageController', ['$scope','$state','SlabsServices','$sce','Jsplumb',

	function($scope, $state, SlabsServices, $sce, Jsplumb ) {

		var vm = this;

		// this sets the state and loads the sidebar into the stage view.
		$state.go('stage.sidebar');

		vm.slabs 								= [];
		vm.iframeSrc 						= '';
		vm.settingsPageVisible 	= false;
		vm.runSlabNetwork 			= runSlabNetwork;
		vm.openSlabSettings 		= openSlabSettings;

		var jsPlumbInstance  		= Jsplumb.getInstance();

		////////////

		function openOutputTabs(outputs){
			console.log(outputs);
			_.each(outputs, function(output){
				console.log(output);
				window.open(output.result);
			});
		}

		function runSlabNetwork(){

			var networkObject = {
				title : 'sample network',
				slabs : vm.slabs
			};

			//console.log(networkObject);

			SlabsServices.network.save({}, networkObject,
				function(resp){
				  console.log('network success!!');
					console.log(resp);
					openOutputTabs(resp.outputs);
			},function(resp){
					console.log('network fail...');
					console.log(resp);
			});

		}

 		// open the slab settings window.
		function openSlabSettings(slab){

			SlabsServices.slab.get({slabType:slab.type, slabID:slab.id}, function(obj){

				if(obj.url){
					vm.settingsPageVisible = true;
					vm.iframeSrc = obj.url;
				}else{
					console.log('error loading settings file');
				}

			});

		}

		// update the slabs array with the new connection.
		function updateConnections(sourceId, targetId, remove){

			_(vm.slabs).each(function(item){

				if(item.guid === targetId){

					if(remove !== true){
						item.dependencies = _.without(item.dependencies, sourceId);
						item.dependencies.push(sourceId);
					}else{
						item.dependencies = _.without(item.dependencies, sourceId);
					}

				}

			});

		}

		// new connection event handler
		function newConnection(connection) {

			// set the label
			var targetName = $(connection.target).data('slab-name');
			var sourceName = $(connection.source).data('slab-name');
			connection.getOverlay('label').setLabel( sourceName+ ' - ' + targetName);

			// update the slabs array to show the new connection
			var targetId 	= connection.target.id;
			var sourceId 	= connection.source.id;
			console.log(sourceId+ ' is now connected to '+targetId );
			updateConnections(sourceId, targetId);

		}

		// dropped connection handler
		function removeConnection(connection){

			// update the slabs array to show the new connection
			var targetId 	= connection.target.id;
			var sourceId 	= connection.source.id;
			console.log(sourceId+ ' is now NOT connected to '+targetId );
			updateConnections(sourceId, targetId, true);

		}


		$('.stage').droppable({

			drop: function( event, ui ) {

				var item 			= ui.helper[0];

				// is slab dropped from the stage or sidebar list.
				var isPanel		= item.classList.contains('panel') === true ? true : false;
				if( isPanel ){
					return;
				}

				// slab settings
				var slabID 		= item.getAttribute('data-slab-id');
				var slabType  = item.getAttribute('data-slab-type');
				var slabName  = item.getAttribute('data-slab-name');
				var guid 			= 'slab_'+Date.now();
				var left			= ui.position.left;
				var top				= ui.position.top - 50; // the 50 is the header

				var slab = {
					guid  				:guid,
					id						:slabID,
					type					:slabType,
					name					:slabName,
					left					:left,
					top						:top,
					settings			:{title:'this is the title', setting:'test setting', setting2:'test setting'},
					dependencies 	:[]
				};

				// add slab to slab network
				vm.slabs.push(slab);
				$scope.$digest();

				// get number of connections in/out
				var slabsIn		= item.getAttribute('data-slab-in');
				var slabsOut  = item.getAttribute('data-slab-out');

				var inConnectorsArray = ['TopCenter', 'TopLeft', 'TopRight'];
				var outConnectorsArray = ['BottomCenter', 'BottomLeft', 'BottomRight'];

				inConnectorsArray.length = slabsIn;
				outConnectorsArray.length = slabsOut;

				Jsplumb.addEndPoint(jsPlumbInstance, guid, outConnectorsArray, inConnectorsArray);

				// listen for new connections
				jsPlumbInstance.bind('connection', function(connInfo, originalEvent) {
					newConnection(connInfo.connection);
				});

				// listen for dropped connections
				jsPlumbInstance.bind('connectionDetached', function(connInfo, originalEvent) {
					removeConnection(connInfo.connection);
				});

				// make slabs draggable
				jsPlumbInstance.draggable(jsPlumb.getSelector('.stage-container .panel'), { grid: [20, 20] });

			}

		});


		// add submit data function
		window.submitSlabData = function(data){

			vm.settingsPageVisible = false;
			$scope.$digest();
		};


	}

]);
