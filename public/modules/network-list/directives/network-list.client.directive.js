'use strict';

angular.module('network-list').directive('networkList', [
	function() {
		return {
			templateUrl: 'modules/network-list/views/network-list.client.view.html',
			restrict: 'E',
			controller: function($scope) {

				var vm = this;

				vm.list = $scope.list;

				//////////

				vm.openNetwork = function(item){
					$scope.openNetwork(item);
				};

			},
			controllerAs: 'ctrl',
			scope: {
				list:'=',
				openNetwork:'&'
			}
		};
	}
]);
