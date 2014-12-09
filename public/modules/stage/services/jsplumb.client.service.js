'use strict';

angular.module('stage').factory('Jsplumb', [

	function() {

		var connectorPaintStyle = {
			lineWidth:4,
			strokeStyle:'#61B7CF',
			joinstyle:'round',
			outlineColor:'white',
			outlineWidth:2
		};

		var connectorHoverStyle = {
			lineWidth:4,
			strokeStyle:'#216477',
			outlineWidth:2,
			outlineColor:'white'
		};

		var endpointHoverStyle = {
			fillStyle:'#216477',
			strokeStyle:'#216477'
		};

		var sourceEndpoint = {
			endpoint:'Dot',
			paintStyle:{
				strokeStyle:'#7AB02C',
				fillStyle:'transparent',
				radius:4,
				lineWidth:3
			},
			isSource:true,
			connector:[ 'Flowchart', { stub:[40, 60], gap:10, cornerRadius:5, alwaysRespectStubs:true } ],
			connectorStyle:connectorPaintStyle,
			hoverPaintStyle:endpointHoverStyle,
			connectorHoverStyle:connectorHoverStyle,
			dragOptions:{}
		};

		// the definition of target endpoints (will appear when the user drags a connection)
		var targetEndpoint = {
			endpoint:'Dot',
			paintStyle:{ strokeStyle:'#5bc0de',radius:4, fillStyle:'transparent',lineWidth:3 },
			hoverPaintStyle:endpointHoverStyle,
			maxConnections:-1,
			dropOptions:{ hoverClass:'hover', activeClass:'active' },
			isTarget:true
		};


		// Public API
		return {

			getInstance: function() {
				return jsPlumb.getInstance({
					// default drag options
					DragOptions : { cursor: 'pointer', zIndex:2000 },
					// the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
					// case it returns the 'labelText' member that we set on each connection in the 'init' method below.
					ConnectionOverlays : [
						[ 'Label', {
							location:0.1,
							id:'label',
							cssClass:'aLabel'
						}]
					],
					Container:'stage-container'
				});
			},

			addEndPoint: function(instance, toId, sourceAnchors, targetAnchors) {

				for (var i = 0; i < sourceAnchors.length; i++) {
					var sourceUUID = toId + sourceAnchors[i];
					instance.addEndpoint(toId, sourceEndpoint, { anchor:sourceAnchors[i], uuid:sourceUUID });
				}
				for (var j = 0; j < targetAnchors.length; j++) {
					var targetUUID = toId + targetAnchors[j];
					instance.addEndpoint(toId, targetEndpoint, { anchor:targetAnchors[j], uuid:targetUUID });
				}

			}



		};

	}
]);
