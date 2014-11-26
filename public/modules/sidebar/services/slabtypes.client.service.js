'use strict';

angular.module('sidebar').factory('Slabtypes', [
	function() {

		var slabTypes = [
			{ id:'api', label:'api\'s' },
			{ id:'static', label:'static data' },
			{ id:'processor', label:'data processors' },
			{ id:'output', label:'data output' }
		];

		// Public API
		return {
			getSlabTypes: function() {
				return slabTypes;
			}
		};
	}
]);
