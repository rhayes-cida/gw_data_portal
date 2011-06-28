var map1;
var mapState = {};
var pointsCount = new Ext.Toolbar.TextItem('0 Points Mapped');

Ext.onReady(function() {
	
	
	map1 = new JMap.web.Map({
		containerEl: 'map-area',
		numTilesX: 7,
		numTilesY: 5,
		centerLat: 37,
		centerLon: -96,
		zoomLevel: 4,
		mapWidthPx: 600,
		mapHeightPx: 600,
		cacheTiles: true,
		border: false,
		projection: new JMap.projection.Mercator(),
		HUD: {
			zoomSlider: true, 
			scaleRake: true,
		 	overviewMap: true//, latLonLabel: true
		}
	});
	
	addOverviewLayers();
		
	//create the EXTJS layout
	new Ext.Panel({
		id: 'ext-content-panel',
		renderTo: 'content',
		layout: 'border',
		height: 640,
		width: 1350,
		plain: true,
		style: 'text-align: left',
		items: [{
			border: true,
			region: 'center',
			layout: 'border',
		    items: [{
				title: 'Click and drag map',
				border: false,
				id: 'cmp-map-area',
				region: 'center',
				contentEl: 'map-area',
				listeners: {
					resize: function(p) {
						if (map1) map1.resize(p.body.getWidth(),p.getInnerHeight());
					}
				}
		    }],
			bbar: [pointsCount]
		},{
			region: 'west',
			width: 300,
			title: 'Filter Map Data',
			bodyStyle: 'padding: 5px',
			autoScroll: true,
			buttonAlign: 'center',
			buttons: [{
				text: 'Map',
				handler: addDataLayer
			}],
			items: [{
				xtype: 'fieldset',
				title: 'Agency',
				contentEl: 'agency-div'
			},{
				xtype: 'fieldset',
				title: 'National Aquifer Name',
				contentEl: 'ntlAquifer-div'
			},{
				xtype: 'fieldset',
				title: '<input id="wl-sn-flag" type="checkbox" checked="checked" value="Yes"/> Water Level Network',
				contentEl: 'wl-well-type-div'
			},{
				xtype: 'fieldset',
				title: '<input id="qw-sn-flag" type="checkbox" checked="checked" value="Yes"/> Water Quality Network',
				contentEl: 'qw-well-type-div'
			}]
		}]
	});
	
	
	//extjs map buttons
	new Ext.ButtonGroup({
		renderTo: 'map-tools',
		id: 'map-tool-buttons',
		columns: 7,
		defaults: {
			iconAlign: 'top',
			tooltipType: 'title',
			style: 'padding: 0px',
			scale: 'medium'
		},
		items: [{
			tooltip: 'Drag Map',
			iconCls: 'hand-drag-icon',
			pressed: true,
			enableToggle: true,
			toggleGroup: 'map-tool-buttons',
			handler: function(b) {
				if (!b.pressed) b.toggle();
				map1.setMouseAction(null);
				Ext.getCmp('cmp-map-area').setTitle('Click and drag map');
			}
		},{
			id: 'id-button',
			tooltip: 'Identify Point',
			iconCls: 'id-reach-icon',
			enableToggle: true,
			toggleGroup: 'map-tool-buttons',
			handler: function(b) {
				if (!b.pressed) b.toggle();
				map1.setMouseAction(IDENTIFY.find);
				Ext.getCmp('cmp-map-area').setTitle('Click on map to identify a point of interest');
			}
		},{
			tooltip: 'Zoom In',
			iconCls: 'zoom-in-icon',
			enableToggle: true,
			toggleGroup: 'map-tool-buttons',
			handler: function(b) {
				if (!b.pressed) b.toggle();
				map1.setMouseAction(JMap.util.Tools.zoomIn);
				Ext.getCmp('cmp-map-area').setTitle('Click or click and drag on map to zoom in');
			}
		},{
			tooltip: 'Zoom Out',
			iconCls: 'zoom-out-icon',
			enableToggle: true,
			toggleGroup: 'map-tool-buttons',
			handler: function(b) {
				if (!b.pressed) b.toggle();
				map1.setMouseAction(JMap.util.Tools.zoomOut)
				Ext.getCmp('cmp-map-area').setTitle('Click on map to zoom out');
			}
		},{
			tooltip: 'Edit Map Layers',
			iconCls: 'map-layers-icon',
			handler: function() {
				(new BaseLayersWindow()).show();
			}
		}]
	});
	
	loadMapLayers();	
});




function getUrlParamStringFromPicklist(id, isString) {
	var s = '';
	var q = (isString)?"'":'';
	var p = document.getElementById(id);
	for (var i = 0; i < p.options.length; i++) {
		if (p.options[i].selected) {
			s += q + p.options[i].value + q + ",";
		}
	}
	
	if (s != '' && s != "'',") {
		return s.substr(0, s.length-1);
	}
	return '';
}



function addDataLayer() {
	
	mapState = {
		agency: getUrlParamStringFromPicklist('agency', true),
		qwWellType: getUrlParamStringFromPicklist('qw-well-type', true),
		wlWellType: getUrlParamStringFromPicklist('wl-well-type', true),
		qwSnFlag: document.getElementById('qw-sn-flag').checked?'Yes':'',
		wlSnFlag: document.getElementById('wl-sn-flag').checked?'Yes':'',
		ntlAquiferName: getUrlParamStringFromPicklist('ntlAquifer', true)
	};

	
	
	Ext.getCmp('cmp-map-area').body.mask('Drawing Map.  Please wait...','x-mask-loading');
	//Ext.getCmp('ext-content-panel').body.mask();
	
	//fit map to data
	Ext.Ajax.request({
		method: 'GET',
		url: 'bbox',
		params: mapState,
		success: function(r,o) {
			Ext.getCmp('cmp-map-area').body.unmask();
			//Ext.getCmp('ext-content-panel').body.unmask();
			var fitJSON = Ext.util.JSON.decode(r.responseText);
			if (fitJSON.bbox == ',,,') {
				Ext.fly(pointsCount.getEl()).update('Number of points meeting criteria: 0');
				Ext.Msg.show({
				   title:'No Sites Found',
				   msg: 'There are no data available for your selection or in your area of interest.',
				   buttons: Ext.Msg.OK,
				   icon: Ext.MessageBox.WARNING
				});
			} else {
				var b = fitJSON.bbox.split(',');
				map1.fitToBBox(parseFloat(b[0]),parseFloat(b[1]),parseFloat(b[2]),parseFloat(b[3]));
				Ext.fly(pointsCount.getEl()).update('Number of points meeting criteria: ' + fitJSON.count);
			}
		},
		failure: function() {
			Ext.getCmp('cmp-map-area').body.unmask();
			//Ext.getCmp('ext-content-panel').body.unmask();
		}
	});
	
	
	
	map1.layerManager.unloadMapLayer(-95);
	map1.appendLayer(new JMap.web.mapLayer.WMSLayer({
		name: 'Data Layer',
		title: 'GW Data Well',
		description: 'Groundwater Data Well',
		id: -95,
		baseUrl: 'mvwms',
		srs: 3785,
		overlap: 15,
		zDepth: -900000,
		isHiddenFromUser: true,
		customParams: mapState
	}));	
}

function loadMapLayers() {

	map1.appendLayer(new JMap.web.mapLayer.MultiServiceLayer({
		id: 29320,
		name: 'Vector Fills',
		description: 'Vector fills is a dynamic map service with the vector base map polygon area fills, i.e. the green national forest areas or the blue water areas. The fills have been split into separate services: _Small, which has tiles for the small scales cached, down through 1:289,000; and _Large, which is dynamic and covers scales 1:144,000 and larger.',
		title: 'Vector Fills',
		legendUrl: 'http://basemap.nationalmap.gov/ArcGIS/rest/services/TNM_Vector_Fills_Small/MapServer/tile/0/0/0.png',
		layers: [
		    new JMap.web.mapLayer.NationalMapTileLayer({
		    	id: 30010,
		    	zDepth: -400000,
		    	minZoom: 0,
		    	maxZoom: 13,
		    	format: 'png',
		    	baseUrl: 'http://basemap.nationalmap.gov/ArcGIS/rest/services/TNM_Vector_Fills_Small/MapServer/tile'
		    }),	
		    new JMap.web.mapLayer.NationalMapWMSLayer({
		    	id: 30011,
		    	zDepth: -400000,
		    	minZoom: 14,
		    	maxZoom: 18,
		    	baseUrl: 'http://services.nationalmap.gov/ArcGIS/rest/services/TNM_Vector_Fills_Large/MapServer/export'
		    })
		]
	}));
	
	map1.appendLayer(new JMap.web.mapLayer.MultiServiceLayer({
		id: 29322,
		name: 'Vectors',
		description: 'This is the beta version of new The National Map, in the Web Mercator projection. There are 20 scales total, from 1:591,657,527 (global) down through 1:1,128. The Vector base map service has been split into two services: _Small, with tiles cached for the small scales, down through 1:288,000; and _Large, a dynamic service for 1:144,000 down through 1:1000. Data Sources: National Atlas - small scales National Map - large scales.',
		title: 'Vectors',
		legendUrl: 'http://basemap.nationalmap.gov/ArcGIS/rest/services/TNM_Vector_Small/MapServer/tile/0/0/0.jpg',
		layers: [
		    new JMap.web.mapLayer.NationalMapTileLayer({
		    	id: 30003,
		    	zDepth: -500000,
		    	minZoom: 0, 
		    	maxZoom: 15,
		    	format: 'jpg',
		    	baseUrl: 'http://basemap.nationalmap.gov/ArcGIS/rest/services/TNM_Vector_Small/MapServer/tile'
		    }),	
		    new JMap.web.mapLayer.NationalMapWMSLayer({
		    	id: 30004,
		    	zDepth: -500000,
		    	minZoom: 16, 
		    	maxZoom: 18,
		    	baseUrl: 'http://services.nationalmap.gov/ArcGIS/rest/services/TNM_Vector_Large/MapServer/export'
		    })
		]
	}));
	
	
	map1.appendLayer(new JMap.web.mapLayer.MultiServiceLayer({
		id: 29327,
		name: 'Shaded Relief',
		description: 'The USGS National Elevation Dataset (NED) has been developed by merging the highest resolution, best-quality elevation data available across the United States into a seamless raster format. NED is the result of the maturation of the USGS effort to provide 1:24,000-scale digital elevation model (DEM) data for the conterminous United States, and 1:63,360-scale DEM data for Alaska. The shaded relief display is derived from NED using a hill-shade technique. NED data are available nationally at grid spacings of 1 arc-second (approximately 30 meters) for the conterminous United States, and at 1/3 and 1/9 arc-seconds (approximately 10 meters and 3 meters, respectively) for parts of the U.S. For additional information, go to http://ned.usgs.gov.',
		title: 'Shaded Relief',
		legendUrl: 'http://raster1.nationalmap.gov/ArcGIS/rest/services/TNM_Small_Scale_Shaded_Relief/MapServer/tile/0/0/0.png',
		layers: [
		    new JMap.web.mapLayer.NationalMapTileLayer({
		    	id: 30005,
		    	zDepth: -150000,
		    	minZoom: 0,
		    	maxZoom: 6,
		    	baseUrl: 'http://raster1.nationalmap.gov/ArcGIS/rest/services/TNM_Small_Scale_Shaded_Relief/MapServer/tile'
		    }),	
		    new JMap.web.mapLayer.NationalMapTileLayer({
		    	id: 30006,
		    	zDepth: -150000,
		    	minZoom: 7,
		    	maxZoom: 10,
		    	baseUrl: 'http://raster1.nationalmap.gov/ArcGIS/rest/services/TNM_Medium_Scale_Shaded_Relief/MapServer/tile'
		    }),	
		    new JMap.web.mapLayer.NationalMapWMSLayer({
		    	id: 30007,
		    	zDepth: -150000,
		    	maxZoom: 18,
		    	minZoom: 11,
		    	baseUrl: 'http://raster.nationalmap.gov/ArcGIS/rest/services/TNM_Large_Scale_Shaded_Relief/MapServer/export'
		    })
		]
	}));
	
	
	map1.appendLayer(new JMap.web.mapLayer.MVMapCacheLayer({
		id: 23413,
		zDepth: -420000,
		opacity: 50,
		legendUrl: 'http://maptrek.er.usgs.gov/mapviewer_11/mcserver?request=gettile&zoomlevel=1&mx=0&my=1&mapcache=gis_cov.natl_aquifers_cache&format=PNG',
		baseUrl: 'http://maptrek.er.usgs.gov/mapviewer_11/mcserver',
		name: 'natl_aquifers_cache',
		dataSource: 'gis_cov',
		title: 'National Aquifers',
		description: '<a href="assets/images/USAaquiferMAP11_17.pdf" target="_blank">National Aquifers Key</a>'
	}));
}

function addOverviewLayers() {
	map1._HUDManager._HUDOverviewMap.overviewMap.appendLayer(
		new JMap.web.mapLayer.MultiServiceLayer({
			id: 29327,
			name: 'Shaded Relief',
			description: 'Shaded Relief',
			title: 'Shaded Relief',
			legendUrl: 'http://raster1.nationalmap.gov/ArcGIS/rest/services/TNM_Small_Scale_Shaded_Relief/MapServer/tile/0/0/0.png',
			layers: [
			    new JMap.web.mapLayer.NationalMapTileLayer({
			    	id: 30005,
			    	zDepth: -150000,
			    	minZoom: 0,
			    	maxZoom: 6,
			    	baseUrl: 'http://raster1.nationalmap.gov/ArcGIS/rest/services/TNM_Small_Scale_Shaded_Relief/MapServer/tile'
			    }),	
			    new JMap.web.mapLayer.NationalMapTileLayer({
			    	id: 30006,
			    	zDepth: -150000,
			    	minZoom: 7,
			    	maxZoom: 10,
			    	baseUrl: 'http://raster1.nationalmap.gov/ArcGIS/rest/services/TNM_Medium_Scale_Shaded_Relief/MapServer/tile'
			    }),	
			    new JMap.web.mapLayer.NationalMapWMSLayer({
			    	id: 30007,
			    	zDepth: -150000,
			    	maxZoom: 18,
			    	minZoom: 11,
			    	baseUrl: 'http://raster.nationalmap.gov/ArcGIS/rest/services/TNM_Large_Scale_Shaded_Relief/MapServer/export'
			    })
			]
		})
	);
	
	map1._HUDManager._HUDOverviewMap.overviewMap.appendLayer(new JMap.web.mapLayer.MultiServiceLayer({
		id: 29322,
		name: 'Vector',
		description: 'Boundaries',
		title: 'Vector',
		legendUrl: 'http://basemap.nationalmap.gov/ArcGIS/rest/services/TNM_Vector_Small/MapServer/tile/0/0/0.jpg',
		layers: [
		    new JMap.web.mapLayer.NationalMapTileLayer({
		    	id: 30003,
		    	zDepth: -500000,
		    	minZoom: 0, 
		    	maxZoom: 15,
		    	format: 'jpg',
		    	baseUrl: 'http://basemap.nationalmap.gov/ArcGIS/rest/services/TNM_Vector_Small/MapServer/tile'
		    }),	
		    new JMap.web.mapLayer.NationalMapWMSLayer({
		    	id: 30004,
		    	zDepth: -500000,
		    	minZoom: 16, 
		    	maxZoom: 18,
		    	baseUrl: 'http://services.nationalmap.gov/ArcGIS/rest/services/TNM_Vector_Large/MapServer/export'
		    })
		]
	}));

	map1._HUDManager._HUDOverviewMap.overviewMap.appendLayer(new JMap.web.mapLayer.MultiServiceLayer({
		id: 29320,
		name: 'Vector Fills',
		description: 'Vector Fills',
		title: 'Vector Fills',
		legendUrl: 'http://basemap.nationalmap.gov/ArcGIS/rest/services/TNM_Vector_Fills_Small/MapServer/tile/0/0/0.png',
		layers: [
		    new JMap.web.mapLayer.NationalMapTileLayer({
		    	id: 30010,
		    	zDepth: -400000,
		    	minZoom: 0,
		    	maxZoom: 13,
		    	format: 'png',
		    	baseUrl: 'http://basemap.nationalmap.gov/ArcGIS/rest/services/TNM_Vector_Fills_Small/MapServer/tile'
		    }),	
		    new JMap.web.mapLayer.NationalMapWMSLayer({
		    	id: 30011,
		    	zDepth: -400000,
		    	minZoom: 14,
		    	maxZoom: 18,
		    	baseUrl: 'http://services.nationalmap.gov/ArcGIS/rest/services/TNM_Vector_Fills_Large/MapServer/export'
		    })
		]
	}));
	
}