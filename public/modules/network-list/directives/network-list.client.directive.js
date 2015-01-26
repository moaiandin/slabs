'use strict';

angular.module('network-list').directive('networkList', [
	function() {
		return {
			templateUrl: 'modules/network-list/views/network-list.client.view.html',
			restrict: 'E',
			controller: function($scope) {

				var vm = this;

				//console.log('$scope.list');
				//console.log($scope.list);

				vm.list = $scope.list;
				vm.caption = $scope.caption;

				//////////

				vm.openNetwork = function(item){
					$scope.openNetwork(item);
				};

				vm.openNetworkView = function(networkId){
					$scope.openNetworkView(networkId);
				};

				vm.upVote = function(network){
					$scope.upVote(network);
				};

			},
			controllerAs: 'ctrl',
			scope: {
				caption:'@',
				list:'=',
				openNetwork:'&',
				openNetworkView:'&',
				upVote:'&'
			}
		};
	}
]);
