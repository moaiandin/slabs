'use strict';

angular.module('stage').controller('StageController', ['$scope','$state',
	function($scope, $state) {

		$state.go('stage.sidebar');

	}
]);
