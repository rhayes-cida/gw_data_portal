GWDP.ui.map.mainMap; //global reference to map, don't know if I like it but I don't care right now

GWDP.ui.map.mercatorProjection = new OpenLayers.Projection("EPSG:900913"); // Use this projection for transformations
GWDP.ui.map.wgs84Projection = new OpenLayers.Projection("EPSG:4326"); // Use this projection for transformations

GWDP.ui.map.setHTML = function (response) {
    alert(response.responseText);
};

GWDP.ui.pointsCount = new Ext.Toolbar.TextItem('0 Points Mapped');

GWDP.ui.initMap = function() {
	var initCenter = new OpenLayers.LonLat(-95, 40);
	GWDP.ui.map.mainMap = new OpenLayers.Map("map-area", {
        center: initCenter.transform(GWDP.ui.map.wgs84Projection, GWDP.ui.map.mercatorProjection),
        units: 'm',
        // Set the maxResolutions and maxExtent as indicated in http://docs.openlayers.org/library/spherical_mercator.html
        maxResolution: 156543.0339,
        numZoomLevels: 12,
        maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34,20037508.34, 20037508.34),
        controls: [
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.ArgParser(),
            new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.LayerSwitcher(),
            new OpenLayers.Control.PanZoom(),
            new OpenLayers.Control.OverviewMap({
            }),
            new OpenLayers.Control.MousePosition({
                id: 'map-area-mouse-position',
            	// Defined formatOutput because the displayProjection was not working.
            	formatOutput: function(lonLat){
            		lonLat.transform(GWDP.ui.map.mercatorProjection, GWDP.ui.map.wgs84Projection);
           			return lonLat.toShortString();
           		}
           	}),
            new OpenLayers.Control.ScaleLine({
                id: 'map-area-scale-line'
            })
        ]
    });
	
	GWDP.ui.addBaseLayers();
	GWDP.ui.map.mainMap.zoomTo(4);
}

GWDP.ui.addBaseLayers = function(){
	// Add base layers to map. Set the projection to the mercator projection in the data layers.
	for (var i = 0; i < GWDP.ui.map.baseLayers.length; i++){
		var baseLayer = new GWDP.ui.map.baseLayers[i].type(
				GWDP.ui.map.baseLayers[i].name,
				GWDP.ui.map.baseLayers[i].url,
	            {
 					isBaseLayer: true,
			        sphericalMercator : true,
			        projection: "EPSG:102113",
			        units: "m",
					layers: GWDP.ui.map.baseLayers[i].layers
				},
				{
					singleTile: true
				}
	        );
		GWDP.ui.map.mainMap.addLayer(baseLayer);
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
