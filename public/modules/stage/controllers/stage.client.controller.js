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
      var ticker = { id:'ticker', settings: {tickInterval:1}, guid:'ticker', name:'ticker', type:'ticker', left:left+'px', top:'50px', slabsIn:0, slabsOut:3, dependencies:[] };

      if(vm.networkID === ''){
        defer.resolve([ticker]);
      }else{

          // if a networkID is passed in we should return the network from the server
            SlabsServices.getNetwork.get({networkID:vm.networkID})
          .$promise.then(function(network){
              vm.title = network.title;
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

      //console.dir(vm.slabs);

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
