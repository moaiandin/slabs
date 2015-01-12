'use strict';

// todo - tests for this class.

angular.module('stage').controller('StageController', ['$scope','$state','SlabsServices','$sce','Jsplumb','Networkvalidator','ngNotify',

	function($scope, $state, SlabsServices, $sce, Jsplumb, Networkvalidator, ngNotify ) {

		var vm = this;

		// this sets the state and loads the sidebar into the stage view.
		$state.go('stage.sidebar');

		var ticker = {
			id:'ticker',
			guid:'ticker',
			name:'ticker',
			type:'ticker',
			left:'50px',
			top:'50px'
		};

		vm.slabs 									= [ticker];
		vm.iframeSrc 							= '';
		vm.currentlyOpenSlab			= '';
		vm.settingsPageVisible 		= false;
		vm.runSlabNetwork 				= runSlabNetwork;
		vm.openSlabSettings 			= openSlabSettings;
		vm.viewOutput 						= viewOutput;
		vm.viewId 								= null;
		vm.removeSlab							= removeSlab;

		var jsPlumbInstance  			= Jsplumb.getInstance();


		////////////


		function init(){

			setTimeout(function(){

				var inConnectorsArray 		= [];
				var outConnectorsArray		= Jsplumb.getOutConnectors();

				Jsplumb.addEndPoints(jsPlumbInstance, 'ticker', outConnectorsArray, inConnectorsArray);

				// make slabs draggable
				jsPlumbInstance.draggable(jsPlumb.getSelector('.stage-container .panel'), { grid: [20, 20] });


			}, 500);

		}


		function openViewTab(viewId){

			var viewURL = '/networkview/'+viewId;
			window.open(viewURL);

		}

		function validateNetwork(){

			var errors = Networkvalidator.validate(vm.slabs);

			if(errors){
				ngNotify.set(errors[0], 'error');
				return false;
			}else{
				return true;
			}

		}

		function runSlabNetwork(){

			if(validateNetwork() === false){
				console.log('validation error');
				return;
			}

			var networkObject = {
				title : 'sample network',
				slabs : vm.slabs
			};

			console.log('calling runSlabNetwork');

			SlabsServices.network.save({}, networkObject,
				function(resp){
				  console.log('network success!!');
					console.log(resp);
					vm.viewId = resp.viewId;
			},function(resp){
					console.log('network fail...');
					console.log(resp);
			});

		}

		function viewOutput(){
			openViewTab(vm.viewId);
		}

 		// open the slab settings window.
		function openSlabSettings(slab){

			SlabsServices.slab.get({slabType:slab.type, slabID:slab.id}, function(obj){

				if(obj.url){
					vm.currentlyOpenSlab = slab.guid;
					vm.settingsPageVisible = true;
					vm.iframeSrc = obj.url;
				}else{
					console.log('error loading settings file');
				}

			});

		}

		// remove a slab from the stage
		function removeSlab(slab){

			var inConnectorsArray 		= Jsplumb.getInConnectors();
			var outConnectorsArray		= Jsplumb.getOutConnectors();

			Jsplumb.removeEndPoints(jsPlumbInstance, slab.guid, outConnectorsArray, inConnectorsArray);

			vm.slabs = _.reject(vm.slabs, function(item){
				return item.guid === slab.guid;
			});

		}

		// update the slabs array with the new connection.
		function updateConnections(sourceId, targetId, remove){

			console.dir(sourceId, targetId, remove);

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

			/* set the label
			var targetName = $(connection.target).data('slab-name');
			var sourceName = $(connection.source).data('slab-name');
			connection.getOverlay('label').setLabel( sourceName+ ' - ' + targetName);
			*/

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

		function addSettingsToSlabList (data){

			var slab = _.findWhere(vm.slabs, { guid:vm.currentlyOpenSlab } );
			slab.settings = data;

			console.dir(vm.slabs);

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
					left					:left+'px',
					top						:top+'px',
					settings			:{},
					dependencies 	:[]
				};

				// add slab to slab network
				vm.slabs.push(slab);
				$scope.$digest();

				// get number of connections in/out
				var slabsIn		= item.getAttribute('data-slab-in');
				var slabsOut  = item.getAttribute('data-slab-out');

				var inConnectorsArray 		= Jsplumb.getInConnectors();
				var outConnectorsArray		= Jsplumb.getOutConnectors();

				inConnectorsArray.length = slabsIn;
				outConnectorsArray.length = slabsOut;

				Jsplumb.addEndPoints(jsPlumbInstance, guid, outConnectorsArray, inConnectorsArray);

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

			addSettingsToSlabList(data);

			vm.settingsPageVisible = false;
			$scope.$digest();
		};

		init();

	}

]);
