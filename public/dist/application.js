'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'slabs';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils', 'ngNotify'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('articles');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('network-list');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('sidebar');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('stage');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Articles', 'articles', 'dropdown', '/articles(/create)?');
		Menus.addSubMenuItem('topbar', 'articles', 'List Articles', 'articles');
		Menus.addSubMenuItem('topbar', 'articles', 'New Article', 'articles/create');
	}
]);
'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('listArticles', {
			url: '/articles',
			templateUrl: 'modules/articles/views/list-articles.client.view.html'
		}).
		state('createArticle', {
			url: '/articles/create',
			templateUrl: 'modules/articles/views/create-article.client.view.html'
		}).
		state('viewArticle', {
			url: '/articles/:articleId',
			templateUrl: 'modules/articles/views/view-article.client.view.html'
		}).
		state('editArticle', {
			url: '/articles/:articleId/edit',
			templateUrl: 'modules/articles/views/edit-article.client.view.html'
		});
	}
]);
'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',

	function($scope, $stateParams, $location, Authentication, Articles) {

		$scope.authentication = Authentication;

		$scope.create = function() {
			var article = new Articles({
				title: this.title,
				content: this.content
			});
			article.$save(function(response) {
				$location.path('articles/' + response._id);

				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(article) {
			if (article) {
				article.$remove();

				for (var i in $scope.articles) {
					if ($scope.articles[i] === article) {
						$scope.articles.splice(i, 1);
					}
				}
			} else {
				$scope.article.$remove(function() {
					$location.path('articles');
				});
			}
		};

		$scope.update = function() {
			var article = $scope.article;

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.articles = Articles.query();
		};

		$scope.findOne = function() {
			$scope.article = Articles.get({
				articleId: $stateParams.articleId
			});
		};
	}
]);

'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', ['$resource',
	function($resource) {
		return $resource('articles/:articleId', {
			articleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');


		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);

'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication','SlabsServices','$state',
	function($scope, Authentication, SlabsServices, $state) {

		var vm = this;

		// This provides Authentication context.
		vm.authentication 	= Authentication;
		vm.showList 				= false;
		vm.recentNetworks  	= []; //SlabsServices.network.query();
		vm.popularNetworks  = []; //SlabsServices.network.query();
		vm.openNetwork    	= openNetwork;
		vm.openNetworkView 	= openNetworkView;

		init();

		/////////////


		function init(){

			getNetworkLists();

		}

		function getNetworkLists(){

			SlabsServices.network.query(function(networks){
				if(networks && networks.length > 0){
					console.log(networks);
					vm.showList 	= true;
					vm.recentNetworks		= networks;
					vm.popularNetworks = networks;
				}
			});

		}


		function upVote(network){

			var networkObject = {
				id : network._id,
				upVotes : network.upVotes + 1
			};

			SlabsServices.network.update({}, networkObject, function(){
				console.log('upvote success');
			}, function(){
				console.log('upvote fail');
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

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

angular.module('stage').factory('SlabsServices', ['$resource',
	function($resource) {

		// Public API
		return {
			network			 : $resource('/network/', null, {
				'update': { method:'PUT' }
			}),
			getNetwork	 	: $resource('/network/:networkID'),
			slabTypes		 	: $resource('/slab/types'),
			slab 				 	: $resource('/slab/:slabType/:slabID'),
			slabList 		 	: $resource('/slab/:slabType')
		};


	}
]);

'use strict';

angular.module('network-list').directive('networkList', [
	function() {
		return {
			templateUrl: 'modules/network-list/views/network-list.client.view.html',
			restrict: 'E',
			controller: ["$scope", function($scope) {

				var vm = this;

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

			}],
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

/* global $:false */
'use strict';

// todo - tests for this class

angular.module('sidebar').controller('SlabListController', ['$scope','SlabsServices','$timeout',

	function($scope, SlabsServices, $timeout) {

		var vm = this;
		vm.typeChanged = typeChanged;
		vm.slabList = SlabsServices.slabList.query({slabType:'source'});

		////////////

		function init(){

			// watch for changes to the slab list
			$scope.$watch(function () {
				return vm.slabList;
			}, makeSlabsDraggable);

			// initialize the 'draggability of slabs in the list'
			makeSlabsDraggable();

		}

		function typeChanged(id){
			console.log('typeChanged');
			vm.slabList = SlabsServices.slabList.query({slabType:id});
		}

		function makeSlabsDraggable(){

			//console.log(' _ _ making draggable');

			var run = function(){
				//console.log(' _ making draggable');
				//console.log($('.slab-list').children());
				$('.slab-list .slab-item').draggable({helper:'clone'});
			};

			$timeout(run, 400);

		}

		init();

	}

]);

'use strict';

angular.module('sidebar').directive('slabTypeSelector', ['SlabsServices',
	function(SlabsServices) {
		return {
			templateUrl: '/modules/sidebar/views/slab-type-selector.client.view.html',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {

				scope.types = SlabsServices.slabTypes.query();

				scope.buttonClicked = function(slabTypeID){
					scope.typeChanged({slabTypeID:slabTypeID});
				};

			},
			scope : {
				typeChanged:'&'
			}
		};
	}
]);

'use strict';

//Setting up route
angular.module('stage').config(['$stateProvider',
	function($stateProvider) {
		// Stage state routing
		$stateProvider
			.state('stage', {
				url: '/stage/:networkID',
				templateUrl: 'modules/stage/views/stage.client.view.html'
			})
			.state('stage.sidebar', {
				templateUrl:'modules/sidebar/views/slab-list.client.view.html'
			});
	}
]);

'use strict';

// todo - tests for this class.

angular.module('stage').controller('StageController', ['$scope', '$state', 'SlabsServices', '$sce', 'Jsplumb', 'Networkvalidator', 'ngNotify', '$stateParams', '$q',

  function ($scope, $state, SlabsServices, $sce, Jsplumb, Networkvalidator, ngNotify, $stateParams, $q) {

    var vm = this;

    // this sets the state and loads the sidebar into the stage view.
    $state.go('stage.sidebar');

    vm.networkID = $stateParams.networkID;
    vm.buttonLabel = vm.networkID ? 'restart' : 'start';
    vm.slabs = [];
    vm.iframeSrc = '';
    vm.currentlyOpenSlab = '';
    vm.title = '';
    vm.settingsPageVisible = false;
    vm.runSlabNetwork = runSlabNetwork;
    vm.openSlabSettings = openSlabSettings;
    vm.viewOutput = viewOutput;
    vm.removeSlab = removeSlab;
    vm.tickerInterval = 10;


    var jsPlumbInstance = Jsplumb.getInstance();

    init();


    ////////////


    function init() {

      getInitialArray().then(function (slabs) {
        vm.slabs = slabs;
        addPlumbing();
      });

    }

    function getInitialArray() {

      var defer = $q.defer();
      var left = ( $('.stage').width() / 2 ) - 90;
      var ticker = { id:'ticker',
        settings: {tickInterval:vm.tickerInterval},
        guid:'ticker',
        name:'ticker',
        type:'ticker',
        left:left+'px',
        top:'50px',
        slabsIn:0,
        slabsOut:3,
        dependencies:[] };

      if(vm.networkID === ''){
        defer.resolve([ticker]);
      }else{

            // if a networkID is passed in we should return the network from the server
            SlabsServices.getNetwork.get({networkID:vm.networkID})
          .$promise.then(function(network){
                vm.title = network.title;
                var ticker = _.findWhere(network.slabs, {guid:'ticker'});
                vm.tickerInterval = ticker.settings.tickInterval;
                defer.resolve(network.slabs);
            });



      }

      return defer.promise;

    }

    // add plumbing to the slabs loaded in
    function addPlumbing() {

      setTimeout(function () {

        _.each(vm.slabs, function (item) {

          var inConnectorsArray = Jsplumb.getInConnectors();
          var outConnectorsArray = Jsplumb.getOutConnectors();

          inConnectorsArray.length = item.slabsIn;
          outConnectorsArray.length = item.slabsOut;

          Jsplumb.addEndPoints(jsPlumbInstance, item.guid, outConnectorsArray, inConnectorsArray);

          if (item.dependencies && item.dependencies.length > 0) {

            _.each(item.dependencies, function (dependencyObject) {

              var inID = dependencyObject.sourceAnchor;
              var outID = dependencyObject.targetAnchor;

              jsPlumbInstance.connect({uuids: [inID, outID], editable: true});

            });

          }


        });

        // make slabs draggable
        jsPlumbInstance.draggable(jsPlumb.getSelector('.stage-container .panel'), {grid: [20, 20]});


      }, 500);

    }

    function openViewTab(networkID) {

      var viewURL = '/networkview/' + networkID;
      window.open(viewURL);

    }

    function validateNetwork() {

      var errors = Networkvalidator.validate(vm.title, vm.slabs);

      if (errors) {
        ngNotify.set(errors[0], 'error');
        return false;
      } else {
        return true;
      }

    }

    // runs the slabs network
    function runSlabNetwork() {

      if (validateNetwork() === false) {
        console.log('validation error');
        return;
      }

      var networkObject = {
        title: vm.title,
        slabs: vm.slabs
      };

      if(vm.networkID){
        networkObject.id = vm.networkID;
        SlabsServices.network.update({}, networkObject, success, fail);
      }else{
        SlabsServices.network.save({}, networkObject, success, fail);
      }

      console.log('saving SlabNetwork');
      console.log(networkObject);

      function fail(resp) {
        console.log('network fail...');
        console.log(resp);
      }

      function success(resp){
        console.log('network saved!!');
        console.log(resp);
        vm.networkID = resp.networkID;
      }

    }

    // opens a network view page
    function viewOutput() {
      openViewTab(vm.networkID);
    }

    // open the slab settings window.
    function openSlabSettings(slab) {

      console.log(slab);

      SlabsServices.slab.get({slabType: slab.type, slabID: slab.id}, function (obj) {

        console.log(obj);

        if (obj.url) {
          vm.currentlyOpenSlab = slab.guid;
          vm.settingsPageVisible = true;
          vm.iframeSrc = obj.url;
        } else {
          console.log('error loading settings file');
        }

      });

    }

    // remove a slab from the stage
    function removeSlab(slab) {

      var inConnectorsArray = Jsplumb.getInConnectors();
      var outConnectorsArray = Jsplumb.getOutConnectors();

      Jsplumb.removeEndPoints(jsPlumbInstance, slab.guid, outConnectorsArray, inConnectorsArray);

      vm.slabs = _.reject(vm.slabs, function (item) {
        return item.guid === slab.guid;
      });

    }

    // update the slabs array with the new connection.
    function updateConnections(sourceId, targetId, remove, sourceAnchor, targetAnchor) {

      //console.dir(sourceId, targetId, remove);

      _(vm.slabs).each(function (item) {

        if (item.guid === targetId) {

          if (remove !== true) {

            item.dependencies = _.reject(item.dependencies, function (depObj) {
              return depObj.guid === sourceId;
            });

            var dependencyObject = {
              guid: sourceId,
              sourceAnchor: sourceAnchor,
              targetAnchor: targetAnchor
            };

            item.dependencies.push(dependencyObject);

          } else {
            item.dependencies = _.reject(item.dependencies, function (depObj) {
              return depObj.guid === sourceId;
            });
          }

        }

      });

    }

    // dropped connection handler
    function removeConnection(connection) {

      // update the slabs array to show the new connection
      var targetId = connection.target.id;
      var sourceId = connection.source.id;
      console.log(sourceId + ' is now NOT connected to ' + targetId);
      updateConnections(sourceId, targetId, true);

    }

    function addSettingsToSlabList(data) {

      var slab = _.findWhere(vm.slabs, {guid: vm.currentlyOpenSlab});
      slab.settings = data;

      if(slab.id === 'ticker'){
        vm.tickerInterval = data.tickInterval;
      }

      console.dir(vm.slabs);

    }

    function updateSlabPosition(guid, left, top) {

      var slab = _.findWhere(vm.slabs, {guid: guid});
      slab.left = left + 'px';
      slab.top = top + 'px';

    }

    $('.stage').droppable({

      drop: function (event, ui) {

        var item = ui.helper[0];
        var left = ui.position.left;
        var top = ui.position.top;

        // is slab dropped from the stage or sidebar list.
        var isPanel = item.classList.contains('panel') === true;
        if (isPanel) {

          var panel_guid = item.getAttribute('id');
          updateSlabPosition(panel_guid, left, top);

          return;
        }

        // slab settings
        var slabID = item.getAttribute('data-slab-id');
        var slabType = item.getAttribute('data-slab-type');
        var slabName = item.getAttribute('data-slab-name');
        var guid = 'slab_' + Date.now();
        var slabsIn = item.getAttribute('data-slab-in');
        var slabsOut = item.getAttribute('data-slab-out');
        top -= 50; // the 50 is the header


        var slab = {
          guid: guid,
          id: slabID,
          type: slabType,
          name: slabName,
          left: left + 'px',
          top: top + 'px',
          settings: {},
          dependencies: [],
          slabsIn: slabsIn,
          slabsOut: slabsOut
        };

        // add slab to slab network
        vm.slabs.push(slab);
        $scope.$digest();

        var inConnectorsArray = Jsplumb.getInConnectors();
        var outConnectorsArray = Jsplumb.getOutConnectors();

        inConnectorsArray.length = slabsIn;
        outConnectorsArray.length = slabsOut;

        Jsplumb.addEndPoints(jsPlumbInstance, guid, outConnectorsArray, inConnectorsArray);

        // listen for new connections
        jsPlumbInstance.bind('connection', function (connInfo, originalEvent) {

          // update the slabs array to show the new connection
          var targetId = connInfo.connection.target.id;
          var sourceId = connInfo.connection.source.id;
          var sourceAnchor = sourceId + '_' + connInfo.sourceEndpoint.anchor.type;
          var targetAnchor = targetId + '_' + connInfo.targetEndpoint.anchor.type;

          updateConnections(sourceId, targetId, false, sourceAnchor, targetAnchor);

        });

        // listen for dropped connections
        jsPlumbInstance.bind('connectionDetached', function (connInfo, originalEvent) {
          removeConnection(connInfo.connection);
        });

        // make slabs draggable
        jsPlumbInstance.draggable(jsPlumb.getSelector('.stage-container .panel'), {grid: [20, 20]});

      }

    });


    // add submit data function
    window.submitSlabData = function (data) {

      addSettingsToSlabList(data);

      vm.settingsPageVisible = false;
      $scope.$digest();
    };


  }

]);

'use strict';

angular.module('stage').directive('slab', [
	function() {
		return {
			templateUrl: '/modules/stage/views/slab.client.view.html',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {

				scope.hideDelete = scope.type === 'ticker';

				scope.bootstrapClass = 'default';
				scope.iconClass = 'glyphicon-time';

				if(scope.type === 'source'){
					scope.iconClass = 'glyphicon-save';
					scope.bootstrapClass = 'info';
				}

				if(scope.type === 'output'){
					scope.iconClass = 'glyphicon-stats';
					scope.bootstrapClass = 'success';
				}
				if(scope.type === 'utility'){
					scope.iconClass = 'glyphicon-cog';
					scope.bootstrapClass = 'warning';
				}

			},
			scope: {
				id:'=',
				guid:'=',
				type:'=',
				name:'=',
				left:'=',
				top:'=',
				in:'=',
				out:'=',
				openSettings:'&',
				removeClicked:'&'
			}
		};
	}
]);

'use strict';

angular.module('stage').factory('Jsplumb', [

  function () {

    var connectorPaintStyle = {
      lineWidth: 3,
      strokeStyle: '#439a46',
      joinstyle: 'round',
      outlineColor: 'white',
      outlineWidth: 2
    };

    var connectorHoverStyle = {
      lineWidth: 2,
      strokeStyle: '#216477',
      outlineWidth: 2,
      outlineColor: 'white'
    };

    var endpointHoverStyle = {
      fillStyle: '#216477',
      strokeStyle: '#216477'
    };

    var sourceEndpoint = {
      endpoint: 'Dot',
      paintStyle: {
        strokeStyle: '#9c27b0',
        fillStyle: '#ffffff',
        radius: 4,
        lineWidth: 3
      },
      isSource: true,
      connector: ['Bezier', {stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true}],
      connectorStyle: connectorPaintStyle,
      hoverPaintStyle: endpointHoverStyle,
      connectorHoverStyle: connectorHoverStyle,
      dragOptions: {}
    };

    // the definition of target endpoints (will appear when the user drags a connection)
    var targetEndpoint = {
      endpoint: 'Dot',
      paintStyle: {strokeStyle: '#439a46', radius: 4, fillStyle: '#ffffff', lineWidth: 3},
      hoverPaintStyle: endpointHoverStyle,
      maxConnections: -1,
      dropOptions: {hoverClass: 'hover', activeClass: 'active'},
      isTarget: true
    };


    // Public API
    return {

      getInstance: function () {
        return jsPlumb.getInstance({
          // default drag options
          DragOptions: {cursor: 'pointer', zIndex: 2000},
          // the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
          // case it returns the 'labelText' member that we set on each connection in the 'init' method below.
          /*ConnectionOverlays : [
           [ 'Label', {
           location:0.5,
           id:'label',
           cssClass:'aLabel'
           }]
           ],*/
          Container: 'stage-container'
        });
      },

      getInConnectors: function () {
        var inConnectorsArray = ['TopCenter', 'TopLeft', 'TopRight'];
        return inConnectorsArray;
      },

      getOutConnectors: function () {
        var outConnectorsArray = ['BottomCenter', 'BottomLeft', 'BottomRight'];
        return outConnectorsArray;
      },

      removeEndPoints: function (instance, endpointId, sourceAnchors, targetAnchors) {

        for (var i = 0; i < sourceAnchors.length; i++) {
          var sourceUUID = endpointId + '_' +  sourceAnchors[i];
          instance.deleteEndpoint(sourceUUID);
        }
        for (var j = 0; j < targetAnchors.length; j++) {
          var targetUUID = endpointId + '_' +  targetAnchors[j];
          instance.deleteEndpoint(targetUUID);
        }

        instance.detachAllConnections(endpointId);

      },

      addEndPoints: function (instance, toId, sourceAnchors, targetAnchors) {

        for (var i = 0; i < sourceAnchors.length; i++) {
          var sourceUUID = toId + '_' + sourceAnchors[i];
          instance.addEndpoint(toId, sourceEndpoint, {anchor: sourceAnchors[i], uuid: sourceUUID});
        }
        for (var j = 0; j < targetAnchors.length; j++) {
          var targetUUID = toId + '_' + targetAnchors[j];
          instance.addEndpoint(toId, targetEndpoint, {anchor: targetAnchors[j], uuid: targetUUID});
        }

      }


    };

  }
]);

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

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);