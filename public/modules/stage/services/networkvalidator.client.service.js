'use strict';

// todo - add scheduler validation in

angular.module('stage').factory('Networkvalidator', [
	function() {

		var Errors = {
			NO_SLABS : 'There doesn\'t seem to be any slabs on the stage',
			DISCONNECTED_SLAB : 'A Slab seems to be "floating", please check : ',
			NO_TITLE : 'Your network must have a title'
		};

		// Public API
		return {

			validate: function(title, slabsList) {

				var valid = true;
				var errors = [];
				var usedSources = [];


				// check there is a title
				if(!title || title === ''){
					errors.push(Errors.NO_TITLE);
				}


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

					if(item.type === 'source') {

						var dependencyFound = false;
						_(usedSources).each(function(source){

							console.log('source.guid : '+source.guid);
							console.log('item.guid : '+item.guid);

							if(item.guid === source.guid){
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
