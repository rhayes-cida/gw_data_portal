GWDP.ui.map.mainMap; //global reference to map, don't know if I like it but I don't care right now

GWDP.ui.map.mercatorProjection = new OpenLayers.Projection("EPSG:900913"); // web mercator
GWDP.ui.map.wgs84Projection = new OpenLayers.Projection("EPSG:4326"); // WGS84

GWDP.ui.map.setHTML = function (response) {
    alert(response.responseText);
};

GWDP.ui.pointsCount = new Ext.Toolbar.TextItem('Calculating Points Mapped...');
GWDP.ui.initExtent = (new OpenLayers.Bounds(-180, 15, -50, 70)).transform(GWDP.ui.map.wgs84Projection, GWDP.ui.map.mercatorProjection);

var cida = new OpenLayers.LonLat(-89.532523, 43.092565);

function dumpExtent(tag, extent, force) {
	console.log("Extent[" + tag +"]: " + extent);
}

GWDP.ui.ClickControl = OpenLayers.Class(OpenLayers.Control, {            
    initialize: function(options) {
        OpenLayers.Control.prototype.initialize.apply(
            this, arguments
        );
        
        this.map = options.map;
        this.clickHandler = options.clickHandler;
        
        this.handler = new OpenLayers.Handler.Click(
            this, {
                'click': this.clickHandler
            }, {
                'single': true
            }
        );
    }
});

GWDP.ui.initMap = function() {
	var initCenter = new OpenLayers.LonLat(-89.5042, 43.0973);
    
	var extent = GWDP.ui.initExtent;
	GWDP.ui.map.mainMap = new OpenLayers.Map("map-area", {
  	  projection: GWDP.ui.map.mercatorProjection,
	  displayProjection: GWDP.ui.map.wgs84Projection,

        // center: initCenter.transform(GWDP.ui.map.wgs84Projection, GWDP.ui.map.mercatorProjection),
        units: 'm',
        // Set the maxResolutions and maxExtent as indicated in http://docs.openlayers.org/library/spherical_mercator.html
        // numZoomLevels: 8,
        maxExtent: extent,
        restrictedExtent: extent,
        
        controls: [
            new OpenLayers.Control.Navigation(),
            // new OpenLayers.Control.ArgParser(),
            new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.LayerSwitcher(),
            new OpenLayers.Control.PanZoom(),
            new OpenLayers.Control.OverviewMap({
            }),
  			new OpenLayers.Control.MousePosition({
                id: 'map-area-mouse-position',
                numDigits: 6
  			}),
            new OpenLayers.Control.ScaleLine({
                id: 'map-area-scale-line'
            })
        ]
    });
	
	
	GWDP.ui.addBaseLayers();	
	GWDP.ui.addNetworkLayers();
	
	GWDP.ui.map.mainMap.zoomToMaxExtent();
	
	//attach point counter update event
	GWDP.ui.map.mainMap.events.register(
		'moveend',
		GWDP.ui.map.mainMap,
		function() {
			GWDP.domain.Well.updateWellCount(GWDP.ui.map.mainMap);
		}
	);
	GWDP.domain.Well.updateWellCount(GWDP.ui.map.mainMap);
	
	//attach click handler for identify function
    var click = new GWDP.ui.ClickControl({
    	map: GWDP.ui.map.mainMap,
    	clickHandler: function(e) {
    		IDENTIFY.identifyLatLon(GWDP.ui.map.mainMap, e);
    	}
    });
    GWDP.ui.map.mainMap.addControl(click);
    click.activate();
    
	// console.log("!! at end of initMap");
};

GWDP.ui.addBaseLayers = function(){
	// Add base layers to map. Set the projection to the mercator projection in the data layers.
	for (var i = 0; i < GWDP.ui.map.baseLayers.length; i++){
		var thisLayer = GWDP.ui.map.baseLayers[i];
		var baseLayer = new GWDP.ui.map.baseLayers[i].type(
				thisLayer.name,
				thisLayer.url,
	            {
 					isBaseLayer: true,
			        sphericalMercator : true,
			        projection: "EPSG:102113",
			        units: "m",
			        transparent: (thisLayer.transparent == null) ? false : thisLayer.transparent,
					layers: thisLayer.layers,
					wrapDateLine: true
				},
				{
					singleTile: true,
					// visibility: baseLayer.initialOn,
					opacity: (thisLayer.opacity == null) ? 1.0 : thisLayer.opacity
				}
	        );
		GWDP.ui.map.mainMap.addLayer(baseLayer);
	}
};

GWDP.ui.addNetworkLayers = function(){
 	// First sort network layers by drawingOrder
	var layersToAdd = GWDP.ui.map.networkLayers;
    layersToAdd.sort(function(a,b){
		if (a.drawingOrder < b.drawingOrder) {
			return -1;
		}
		else if (a.drawingOrder > b.drawingOrder) {
			return 1;
		}
		else {
			return 0;
		}
	});

	// Add the sorted layers.
	for (var j = 0; j < layersToAdd.length; j++){
		var thisLayer = layersToAdd[j];
		var wmsLayer = new thisLayer.type(
				thisLayer.name,
				thisLayer.url,
				{
					layers: thisLayer.layers,
					transparent: true
				},
				{
					displayInLayerSwitcher: false,
					singleTile: true,
					visibility: thisLayer.initialOn,
					opacity: thisLayer.opacity
				});
		GWDP.ui.map.mainMap.addLayer(wmsLayer);
	}
};

GWDP.ui.getLayerByName = function(name, layers) {
	// Return the layer in layers that matches name. Return nothing if there is no match
	for (var i = 0; i < layers.length; i++){
		if (layers[i].name == name){
			return layers[i];
		}
	}
	return null;
};

GWDP.ui.setHelpContext = function(config/* contains a title and content properties */){
	// Set the help section title and content. Add a click event handler to any faq links to set the active tab.
	Ext.getCmp('help-context-panel').setTitle(config.title);
	document.getElementById('help-context-content').innerHTML = config.content;

	if (config.faq_link_id) {
		Ext.get(config.faq_link_id).on('click', function() {
			Ext.getCmp('map-and-tabs').setActiveTab('faqs-tab');
			return true;
		});
	}
};

GWDP.ui.toggleLayerMap = function(name, on){
	// Set the visibility of the layers in mainMap whose name matches "name" to on.
	var layerList = GWDP.ui.map.mainMap.getLayersByName(name);
	for (var i=0; i < layerList.length; i++){
		layerList[i].setVisibility(on);
	}
	return;
};

GWDP.ui.turnOnLayerMap = function(name, layers){
	// Set visibility to on the layer matching name in layers to the map.
	// All other layers in should be turned off that are in the layers array.
	for (var i = 0; i < layers.length; i++){
		var layerList = GWDP.ui.map.mainMap.getLayersByName(layers[i].name);
		for (var j = 0; j < layerList.length; j++) {
			layerList[j].setVisibility(layers[i].name == name);
		}
	}
	return;
};

GWDP.ui.getLegendWithHeaderHtml = function(legend /* object with name and imgHtml properties*/) {
	return '<p><b>' + legend.name + '</b></p>' + legend.imgHtml + '<br />';
};

GWDP.ui.turnOnLegend = function(name, layers, div_id){
	// Show the legend information for the layer in layers with a name equal to name in the div element, div_id.
	// If name doesn't exist in layers, then set the div element to null string.
	for (var i = 0; i < layers.length; i++){
		if (layers[i].name == name) {
			var legendHtml = '';
			var helpDivs = []; // This collects the divs for which we need to add a click event handler for help

			for (var j = 0; j < layers[i].legend.length; j++){
				var thisLegend = layers[i].legend[j];
				if (thisLegend.helpContext) {
					helpDivs.push({div: thisLegend.divId, helpContext: thisLegend.helpContext});
				}
				legendHtml = legendHtml + '<div id="' + thisLegend.divId + '">' + GWDP.ui.getLegendWithHeaderHtml(thisLegend) + '</div><br />';
			}
			document.getElementById(div_id).innerHTML = legendHtml;
			// Add help click handlers
			for (var k = 0; k < helpDivs.length; k++){
				Ext.get(helpDivs[k].div).on('click', function() {
					GWDP.ui.setHelpContext(GWDP.ui.helpContext[this]);
				},
				helpDivs[k].helpContext);
			}

			return;
		}
	}
	document.getElementById(div_id).innerHTML='';
	return;
};

GWDP.ui.toggleLegend = function(name, layers, on) {
	// If on is true, retrieve the legend for the layer in layers that matches name, and
	// assign it to that layer's div element. If false, set the layer's div element to
	// the null string. This assumes one legend in legend
	var thisLayer = GWDP.ui.getLayerByName(name, layers);
	var divEl = document.getElementById(thisLayer.legend[0].divId);

	if (on) {
		divEl.innerHTML = GWDP.ui.getLegendWithHeaderHtml(thisLayer.legend[0]) + '<br />';
	}
	else {
		divEl.innerHTML = '';
	}
	return;
};