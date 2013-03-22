GWDP.ui.map.mainMap; //global reference to map, don't know if I like it but I don't care right now

GWDP.ui.map.mercatorProjection = new OpenLayers.Projection("EPSG:900913"); // web mercator
GWDP.ui.map.wgs84Projection = new OpenLayers.Projection("EPSG:4326"); // WGS84

GWDP.ui.map.setHTML = function (response) {
    alert(response.responseText);
};

GWDP.ui.initExtent = (new OpenLayers.Bounds(-180, 15, -50, 70)).transform(GWDP.ui.map.wgs84Projection, GWDP.ui.map.mercatorProjection);

var cida = new OpenLayers.LonLat(-89.532523, 43.092565);

function dumpExtent(tag, extent, force) {
	console.log("Extent[" + tag +"]: " + extent);
}

GWDP.ui.map.siteSelector;

GWDP.ui.initMap = function() {
	var initCenter = new OpenLayers.LonLat(-89.5042, 43.0973);
    
	var extent = GWDP.ui.initExtent;
	
	GWDP.ui.map.siteSelector = new GWDP.ui.SiteSelector({
 	   store: GWDP.domain.getArrayStore(GWDP.domain.Well.fields, "wells"),
 	   emptyText: 'Ctrl + click to select a site. Hold Ctrl and drag a box to select a group of sites.'
    });
	
	GWDP.ui.map.mainMap = new OpenLayers.Map("map-area", {
		projection: GWDP.ui.map.mercatorProjection,
		displayProjection: GWDP.ui.map.wgs84Projection,
		units: 'm',
		maxExtent: extent,
		controls: [
		           new OpenLayers.Control.Navigation(),
		           new OpenLayers.Control.Attribution(),
		           new GWDP.ui.LayerSwitcher(),
		           new GWDP.ui.ExtJSTools({
		        	   id: 'mapTools',
		        	   tools: [
				    	 		{
				    	 			id: 'info',
				    	 			handler: GWDP.ui.toggleHelpTips
				    	 		},{
				    	 			id: 'help',
				    	 			handler: function(event, toolEl, panel,tc) {
				    	 				var myWin = Ext.create({
				    	 					title: 'NGWMN Help',
				    	 					xtype: 'window',
				    	 					modal: true,
				    	 					html: '<iframe src="https://my.usgs.gov/confluence/display/ngwmn/NGWMN+Data+Portal+Help" width="100%" height="100%" ></iframe>',
				    	 					width: 970,
				    	 					height: 600
				    	 				});
				    	 				myWin.show();
				    	 		    }
				    	 		},{
				    	 			id: 'maximize',
				    	 	        handler: GWDP.ui.toggleMaximized
				    	 		},{
				    	 			id: 'restore',
				    	 			hidden: true,
				    	 	        handler: GWDP.ui.toggleMaximized
				    	 		}
				    	 	]
		           }),
		           GWDP.ui.map.siteSelector,
		           new GWDP.ui.PanZoomControl({
		        	   zoomButtonHandler: GWDP.ui.map.zoomToBoundingBox
		           }),
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
			GWDP.ui.setLoadingMasksForUpdateMap();
			GWDP.domain.Well.updateWellCount(
					GWDP.ui.map.baseWFSServiceUrl, 
					GWDP.ui.getCurrentExtentAsString(), 
					GWDP.ui.getCurrentFilterCQLAsString(GWDP.ui.getFilterFormValues()),
					GWDP.ui.getUpdateMapHandlers()
			);
		}
	);
	
	GWDP.ui.setLoadingMasksForUpdateMap();
	
	GWDP.domain.Well.updateWellCount(
			GWDP.ui.map.baseWFSServiceUrl, 
			GWDP.ui.getCurrentExtentAsString(), 
			null,
			GWDP.ui.getUpdateMapHandlers()
	);
	
	GWDP.ui.attachCustomControls();
};

GWDP.ui.attachCustomControls = function() {
    var hover = new GWDP.ui.HoverControl({
    	map: GWDP.ui.map.mainMap,
    	pauseHandler: function(e) {
    		GWDP.ui.showAHelpTip();
    	}
    });
    GWDP.ui.map.mainMap.addControl(hover);
    hover.activate();

    //this handles ctrl+drag
    var zoombox = new GWDP.ui.ZoomBoxControl({
    	map: GWDP.ui.map.mainMap,
    	keyMask: OpenLayers.Handler.MOD_CTRL,
    	boxHandler: function(bounds) {
    		GWDP.ui.map.addSiteInBounds(bounds);
    	}
    });
    GWDP.ui.map.mainMap.addControl(zoombox);
    zoombox.activate();
    
	var click = new GWDP.ui.ClickControl({
    	map: GWDP.ui.map.mainMap,
    	clickHandler: function(e) {
    		if(e.ctrlKey) {
    			GWDP.ui.map.addSiteAt(GWDP.ui.map.mainMap, e);
    		} else {
    			IDENTIFY.identifyLatLon(GWDP.ui.map.mainMap, e);
    		}	
		}
    });
    GWDP.ui.map.mainMap.addControl(click);
    click.activate();
};



GWDP.ui.addBaseLayers = function(){
	// Add base layers to map. Set the projection to the mercator projection in the data layers.
	for (var i = 0; i < GWDP.ui.map.baseLayers.length; i++){
		var thisLayer = GWDP.ui.map.baseLayers[i];
		var baseLayer = new GWDP.ui.map.baseLayers[i].type(
				thisLayer.name,
				thisLayer.url,
	            {
 					isBaseLayer: (thisLayer.isBaseLayer == null) ? true : thisLayer.isBaseLayer,
			        sphericalMercator : true,
			        projection: GWDP.ui.map.mercatorProjection.getCode(),
			        units: "m",
			        transparent: (thisLayer.transparent == null) ? false : thisLayer.transparent,
					layers: thisLayer.layers,
					wrapDateLine: true,
					visibility: (thisLayer.initialOn == null) ? true : thisLayer.initialOn
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
		wmsLayer.params['CQL_FILTER'] = GWDP.ui.getCurrentFilterCQLAsString(GWDP.ui.getFilterFormValues());
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

GWDP.ui.setLoadingMasksForUpdateMap = function () {
	GWDP.ui.pointsCount.update("Calculating Sites Mapped...");
	GWDP.ui.waterLevelCount.update("");
	GWDP.ui.waterQualityCount.update("");
};

GWDP.ui.getUpdateMapHandlers = function() {
	return {
		totalCount : function(numOfRecs) {
			GWDP.ui.pointsCount.update(numOfRecs + " Sites Mapped");
		},
		waterLevelCount : function(numOfRecs) {
			GWDP.ui.waterLevelCount.update(numOfRecs + " water-level network wells");
		},
		waterQualityCount : function(numOfRecs) {
			GWDP.ui.waterQualityCount.update(numOfRecs + " water-quality network wells");
		}
	};
};

GWDP.ui.getCurrentExtentAsString = function() {
	var bounds = GWDP.ui.map.mainMap.getExtent();
	var bbox = bounds.transform(GWDP.ui.map.mercatorProjection,GWDP.ui.map.wgs84Projection);
	var bboxArray = bbox.toArray();
	var WFSbbox = GWDP.domain.convertXyToYx(bboxArray); 
	return WFSbbox;
};

GWDP.ui.getUpdateMap = function() {
	var networkLayer = GWDP.ui.map.mainMap.getLayersByName('VW_GWDP_GEOSERVER')[0];
	var filterCQL = GWDP.ui.getCurrentFilterCQLAsString(GWDP.ui.getFilterFormValues());
	if(filterCQL) {
		networkLayer.params['CQL_FILTER'] = filterCQL;
	} else {
		delete networkLayer.params['CQL_FILTER'];
	}
	networkLayer.redraw();
	
	GWDP.ui.setLoadingMasksForUpdateMap();
	
	GWDP.domain.Well.updateWellCount(
			GWDP.ui.map.baseWFSServiceUrl, 
			GWDP.ui.getCurrentExtentAsString(), 
			filterCQL,
			GWDP.ui.getUpdateMapHandlers()
	);
};

GWDP.ui.map.zoomToBoundingBox = function() {
	var filterCQL = GWDP.ui.getCurrentFilterCQLAsString(GWDP.ui.getFilterFormValues());
	var mapCt = Ext.getCmp('cmp-map-area').getEl();
	mapCt.mask("Calculating extent...");
	GWDP.domain.Well.getWellBoundingBox(
		GWDP.ui.map.baseWFSServiceUrl, 
		"-180,15,-50,70", 
		filterCQL, 
		function(bbox){
			if(!bbox) {
				GWDP.ui.map.mainMap.zoomToMaxExtent();
			} else {
				var bounds = new OpenLayers.Bounds(bbox[0], bbox[1], bbox[2], bbox[3]);
				GWDP.ui.map.mainMap.zoomToExtent(bounds.transform(GWDP.ui.map.wgs84Projection, GWDP.ui.map.mercatorProjection));
			}
			mapCt.unmask();
		}
	);
};

GWDP.ui.map.getBBOXAroundPoint = function(map, e) {
	var pixelClicked = e.xy; //supports openlayers.point as well as window.event
	
	var deadzone = 5;
	var clickLLMax = map.getLonLatFromPixel(new OpenLayers.Pixel(pixelClicked.x + deadzone, pixelClicked.y + deadzone)).transform(GWDP.ui.map.mercatorProjection,GWDP.ui.map.wgs84Projection);
	var clickLLMin = map.getLonLatFromPixel(new OpenLayers.Pixel(pixelClicked.x - deadzone, pixelClicked.y - deadzone)).transform(GWDP.ui.map.mercatorProjection,GWDP.ui.map.wgs84Projection);
	
	var bbox = clickLLMin.lon + "," + clickLLMax.lat + "," + clickLLMax.lon + "," + clickLLMin.lat;
	
	return bbox;
};

GWDP.ui.map.addSiteAt = function(map,e) {
	var bbox = GWDP.ui.map.getBBOXAroundPoint(map,e);
	GWDP.ui.map.addSitesInBbox(bbox);
};

GWDP.ui.map.addSiteInBounds = function(bounds) {
	var bbox = bounds.transform(GWDP.ui.map.mercatorProjection,GWDP.ui.map.wgs84Projection).toBBOX();
	GWDP.ui.map.addSitesInBbox(bbox);
};

GWDP.ui.map.addSitesInBbox = function(bbox) {
	var wellStore = GWDP.domain.getArrayStore(GWDP.domain.Well.fields, "wells");
	var cql_filters = GWDP.ui.getCurrentFilterCQLAsString(GWDP.ui.getFilterFormValues());
	Ext.getCmp('cmp-map-area').body.mask('Identifying site(s) to add.  Please wait...', 'x-mask-loading');
	GWDP.domain.Well.getWells(GWDP.ui.map.baseWFSServiceUrl, bbox, cql_filters, function(r){
		Ext.getCmp('cmp-map-area').body.unmask();
		if (r.length == 0) {
			//no sites found
			Ext.Msg.show({
			   title:'No Sites Identified',
			   msg: 'No sites were found near the point you clicked.',
			   buttons: Ext.Msg.OK,
			   icon: Ext.MessageBox.WARNING
			});
		} else if (r.length == 1) {
			GWDP.domain.loadOpenlayersRecordIntoArrayStore(r, wellStore);
			var siteRecord = wellStore.getAt(0);
			siteRecord.data.SITE_NAME = SITE.createName(siteRecord.data.SITE_NAME, siteRecord.data.AGENCY_CD, siteRecord.data.SITE_NO);
			GWDP.ui.map.siteSelector.addSitesFromStore(wellStore);
			if(GWDP.ui.map.siteSelector.store.getCount()>0) {
				GWDP.ui.map.siteSelector.maximizeControl();
			}
		} else {
			for (var j=0; j<r.length; j++){
				var siteRecord = r[j];
				siteRecord.data.SITE_NAME = SITE.createName(siteRecord.data.SITE_NAME, siteRecord.data.AGENCY_CD, siteRecord.data.SITE_NO);
			}
			GWDP.domain.loadOpenlayersRecordIntoArrayStore(r, wellStore);
			(new SiteIdSelectorPopup({store: wellStore})).show();
		}
	});
};

