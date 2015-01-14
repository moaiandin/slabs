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
