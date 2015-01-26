'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication','SlabsServices','$state',
	function($scope, Authentication, SlabsServices, $state) {

		var vm = this;

		// This provides Authentication context.
		vm.authentication 	= Authentication;
		vm.showList 				= false;
		vm.recentNetworks  	= [];
		vm.popularNetworks  = [];
		vm.openNetwork    	= openNetwork;
		vm.openNetworkView 	= openNetworkView;
		vm.upVote 					= upVote;

		init();

		/////////////


		function init(){

			getNetworkLists();

		}

		function getNetworkLists(){


			SlabsServices.network.query(function(recentNetworks){

				if(recentNetworks && recentNetworks.length > 0){

					SlabsServices.getNetworksByVotes.query(function(popularNetworks){

						if(popularNetworks && popularNetworks.length > 0){

							vm.showList 	= true;
							vm.popularNetworks = popularNetworks;
							vm.recentNetworks		= recentNetworks;

						}
					});

				}
			});




		}


		function upVote(network){

			var item = _.findWhere(vm.recentNetworks, {_id : network._id});
			if(item) item.upVotes += 1;
			item = _.findWhere(vm.popularNetworks, {_id : network._id});
			if(item) item.upVotes += 1;

			SlabsServices.upVoteNetwork.get({networkId:network._id}, function(){
				console.log('upvote success');
			}, function(err){
				console.log('upvote fail');
				console.log(err);
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
