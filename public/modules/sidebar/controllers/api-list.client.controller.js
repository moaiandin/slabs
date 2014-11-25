'use strict';

angular.module('sidebar').controller('ApiListController', ['$scope','ApiSlabs',

	function($scope, ApiSlabs) {

		$scope.apiSlabs = ApiSlabs.query();

	}

]);
