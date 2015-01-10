'use strict';

angular.module('stage').factory('Networkvalidator', [
	function() {

		var Errors = {
			NO_SLABS : 'There doesn\'t seem to be any slabs on the stage',
			DISCONNECTED_SLAB : 'A Slab seems to be "floating" - all slabs need to have at least 1 connection, please check : '
		};

		// Public API
		return {

			validate: function(slabsList) {

				var valid = true;
				var errors = [];
				var usedSources = [];

				// check that there are slabs on the stage
				if(slabsList.length === 0){
					errors.push(Errors.NO_SLABS);
				}

				// check that all outputs are connected to something
				_(slabsList).each(function(item){
					if(item.type === 'output') {
						if (item.dependencies.length === 0) {
							valid = false;
							errors.push(Errors.DISCONNECTED_SLAB + item.name);
						}
					}

					usedSources = usedSources.concat(item.dependencies);
				});

				// check that all sources are connected to something
				_(slabsList).each(function(item){

					if(item.type === 'api') {

						var dependencyFound = false;
						_(usedSources).each(function(source){
							if(item.guid === source){
								dependencyFound = true;
							}
						});

						if(dependencyFound === false){
							errors.push(Errors.DISCONNECTED_SLAB + item.name);
						}
					}

				});

				if(errors.length > 0){
					return errors;
				}else{
					return false;
				}

			}

		};
	}
]);
