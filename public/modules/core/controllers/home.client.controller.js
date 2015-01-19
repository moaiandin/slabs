'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication','SlabsServices','$state',
	function($scope, Authentication, SlabsServices, $state) {

		var vm = this;

		// This provides Authentication context.
		vm.authentication 	= Authentication;
		vm.showList 				= false;
		vm.networks  				= []; //SlabsServices.network.query();
		vm.openNetwork    	= openNetwork;
		vm.openNetworkView 	= openNetworkView;

		init();

		/////////////


		function init(){

			getNetworkList();

		}

		function getNetworkList(){

			SlabsServices.network.query(function(networks){
				if(networks && networks.length > 0){
					console.log(networks);
					vm.showList 	= true;
					vm.networks		= networks;
				}
			});

		}

		function openNetwork(item){
			console.log('openNetwork');
			console.log(item);
			$state.go('stage', {networkID:item._id});
		}

		function openNetworkView(networkId){
			console.log('openNetworkView');
			console.log(networkId);
			var viewURL = '/networkview/' + networkId;
			window.open(viewURL);
		}


	}
]);
