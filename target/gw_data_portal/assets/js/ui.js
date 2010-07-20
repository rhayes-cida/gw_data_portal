var map;
var mapState = {};

Ext.onReady(function() {
	
	
	map1 = new JMap.web.Map({
		containerEl: 'map-area',
		numTilesX: 7,
		numTilesY: 5,
		centerLat: 37,
		centerLon: -96,
		zoomLevel: 2,
		mapWidthPx: 600,
		mapHeightPx: 600,
		cacheTiles: true,
		border: false,
		projection: new JMap.projection.Mercator(),
		HUD: {
			zoomSlider: true, 
			scaleRake: true
		}
	});
	
	//create the EXTJS layout
	new Ext.Panel({
		id: 'ext-content-panel',
		renderTo: 'content',
		layout: 'border',
		height: 630,
		width: 1350,
		plain: true,
		style: 'text-align: left',
		items: [{
			title: 'Click and drag map',
			region: 'center',
			id: 'cmp-map-area',
			contentEl: 'map-area',
			listeners: {
				bodyresize: function(p) {
					if (map1) map1.resize(p.body.getWidth()-2,p.body.getHeight()-1);
				}
			}
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
				title: 'Water Quality Well Type',
				contentEl: 'qw-well-type-div'
			},{
				xtype: 'fieldset',
				title: 'Water Level Well Type',
				contentEl: 'wl-well-type-div'
			},{
				xtype: 'fieldset',
				title: 'National Aquifer Name',
				contentEl: 'ntlAquifer-div'
			}]
		},{
			region: 'east',
			id: 'ext-tnm-tree',
			title: 'Base Data Layers',
			width: 300,
			rootVisible: false,
			xtype: 'treepanel',
	        loader: new Ext.tree.TreeLoader({preloadChildren: true}),
	        listeners: {
				checkchange: function(n, checked){

                	if (n.isLeaf()) {
                		var ml = findParentMapLayer(n);
                		if (n.ui.isChecked()) {
                			ml.appendSubLayer(n.attributes.subId);
                		} else {
                			ml.removeSubLayer(n.attributes.subId);
                		}
                		ml.draw();
                	} else if (n.attributes.layerId) {
                		if (n.attributes.type != 'tiled')
                			refreshSubLayers(n, n.attributes.layerId);
                		
                		if (n.ui.isChecked()) {
                			map1.appendLayer(n.attributes.layerId);
                		} else {
                			map1.removeLayer(n.attributes.layerId);
                		}
                	} else {
                		if (n.attributes.type != 'tiled')
                			refreshSubLayers(n, n.parentNode.attributes.layerId);
                		
                	}
				}
			},
	        root: new Ext.tree.AsyncTreeNode({
	            expanded: true,
	            children: [{
	                text: 'U.S. Topo: Current Available',
	                checked: false,
	                layerId: 29331,
	                children: [{
	                	text: 'Index of Available Maps',
		                checked: true,
	                	leaf: true,
	                	subId: 0
	                },{
	                	text: '7.5 Minute Index',
		                checked: true,
	                	leaf:true,
	                	subId: 1
	                },{
	                	text: '7.5 Minute Labels',
		                checked: true,
	                	leaf: true,
	                	subId: 2
	                }]
	            },{
	                text: 'Geographic Names (GNIS)',
	                checked: false,
	                layerId: 29332,
	                children: [{
	                	text: 'Structure',
		                checked: true,
	                	leaf: true,
	                	subId: 0
	                },{
	                	text: 'Transportation',
	                	checked: true,
	                	leaf: true,
	                	subId: 1
	                },{
	                	text: 'Administrative',
	                	checked: true,
	                	leaf: true,
	                	subId: 2
	                },{
	                	text: 'Historical',
	                	checked: true,
	                	leaf: true,
	                	subId: 3
	                },{
	                	text: 'Community',
	                	checked: true,
	                	leaf: true,
	                	subId: 4
	                },{
	                	text: 'Cultural',
	                	checked: true,
	                	leaf: true,
	                	subId: 5
	                },{
	                	text: 'Landform',
	                	checked: true,
	                	leaf: true,
	                	subId: 6
	                },{
	                	text: 'Hydro Points',
	                	checked: true,
	                	leaf: true,
	                	subId: 7
	                },{
	                	text: 'Hydro Lines',
	                	checked: true,
	                	leaf: true,
	                	subId: 8
	                },{
	                	text: 'Antarctica',
	                	checked: true,
	                	leaf: true,
	                	subId: 9
	                }]
	            },{
	                text: 'Structures',
	                checked: false,
	                layerId: 29333,
	                children: [{
	                	text: 'Public Attractions and Landmark Buildings',
	                	checked: false,
	                	children: [{
	                		text: 'Campground',
		                	checked: true,
	                		leaf: true,
	                		subId: 0
	                	},{
	                		text: 'Cemetery',
	                		leaf: true,
		                	checked: true,
	                		subId: 1
	                	},{
	                		text: 'Trailhead',
	                		leaf: true,
		                	checked: true,
	                		subId: 2
	                	}]
	                },{
	                	text: 'Water Supply and Treatment',
		                checked: false,
	                	leaf:true
	                },{
	                	text: 'Health and Medical',
		                checked: false,
	                	leaf: true
	                },{
	                	text: 'Emergency Response and Law Enforcement',
		                checked: false,
	                	leaf: true
	                },{
	                	text: 'Education',
		                checked: false,
	                	leaf: true
	                }]
	            },{
	                text: 'Transportation',
	                checked: false,
	                layerId: 29330,
	                children: [{
	                	text: 'Airports',
		                checked: true,
		                subId: 0,
	                	leaf: true
	                },{
	                	text: 'Airport Labels',
		                checked: true,
		                subId: 1,
	                	leaf:true
	                },{
	                	text: 'Interstate',
		                checked: true,
		                subId: 2,
	                	leaf: true
	                },{
	                	text: 'Interstate Labels',
		                checked: true,
		                subId: 3,
	                	leaf: true
	                },{
	                	text: 'US Route',
		                checked: true,
		                subId: 4,
	                	leaf: true
	                },{
	                	text: 'US Route Labels',
		                checked: true,
		                subId: 5,
	                	leaf: true
	                },{
	                	text: 'State Route',
		                checked: true,
		                subId: 6,
	                	leaf: true
	                },{
	                	text: 'State Route Labels',
		                checked: true,
		                subId: 7,
	                	leaf: true
	                },{
	                	text: 'County Route',
		                checked: true,
		                subId: 8,
	                	leaf: true
	                },{
	                	text: 'County Route Labels',
		                checked: true,
		                subId: 9,
	                	leaf: true
	                },{
	                	text: 'Local Road',
		                checked: true,
		                subId: 10,
	                	leaf: true
	                },{
	                	text: 'Local Road Labels',
		                checked: true,
		                subId: 11,
	                	leaf: true
	                }]
	            },{
	            	text: 'Governmental Unit Boundaries',
	            	checked: false,
	            	layerId: 29334,
	            	children: [{
	            		text: 'Reserves',
	            		checked: true,
	            		leaf: true,
	            		subId: 0
	            	},{
	            		text: 'Reserves Labels',
	            		checked: true,
	            		leaf: true,
	            		subId: 1
	            	},{
	            		text: 'Native American Areas',
	            		checked: true,
	            		leaf: true,
	            		subId: 2
	            	},{
	            		text: 'Native American Areas Labels',
	            		checked: true,
	            		leaf: true,
	            		subId: 3
	            	},{
	            		text: 'Counties or Equivalent',
	            		checked: true,
	            		leaf: true,
	            		subId: 4
	            	},{
	            		text: 'Counties or Equivalent Labels',
	            		checked: true,
	            		leaf: true,
	            		subId: 5
	            	},{
	            		text: 'Unincorporated Places',
	            		checked: true,
	            		leaf: true,
	            		subId: 6
	            	},{
	            		text: 'Unincorporated Places Labels',
	            		checked: true,
	            		leaf: true,
	            		subId: 7
	            	},{
	            		text: 'Incorporated Places',
	            		checked: true,
	            		leaf: true,
	            		subId: 8
	            	},{
	            		text: 'Incorporated Places Labels',
	            		checked: true,
	            		leaf: true,
	            		subId: 9
	            	},{
	            		text: 'Minor Civil Divisions',
	            		checked: true,
	            		leaf: true,
	            		subId: 10
	            	},{
	            		text: 'Minor Civil Divisions Labels',
	            		checked: true,
	            		leaf: true,
	            		subId: 11
	            	},{
	            		text: 'Zip Codes',
	            		checked: true,
	            		leaf: true,
	            		subId: 12
	            	},{
	            		text: 'Zip Codes Labels',
	            		checked: true,
	            		leaf: true,
	            		subId: 13
	            	},{
	            		text: 'School Districts',
	            		checked: true,
	            		leaf: true,
	            		subId: 14
	            	},{
	            		text: 'School Districts Labels',
	            		checked: true,
	            		leaf: true,
	            		subId: 15
	            	},{
	            		text: 'State or Territory (low res)',
	            		checked: true,
	            		leaf: true,
	            		subId: 16
	            	},{
	            		text: 'State or Territory (low res) Labels',
	            		checked: true,
	            		leaf: true,
	            		subId: 17
	            	},{
	            		text: 'State or Territory (high res)',
	            		checked: true,
	            		leaf: true,
	            		subId: 18
	            	},{
	            		text: 'State or Territory (high res) Labels',
	            		checked: true,
	            		leaf: true,
	            		subId: 19
	            	},{
	            		text: '111th Congressional Districts',
	            		checked: true,
	            		leaf: true,
	            		subId: 20
	            	},{
	            		text: '111th Congressional Districts Labels',
	            		checked: true,
	            		leaf: true,
	            		subId: 21
	            	}]
	            },{
	            	text: 'Map Indices',
	                checked: false,
	                layerId: 29335,
	                children: [{
	            		text: '100K Index',
	            		checked: true,
	            		leaf: true,
	            		subId: 0
	            	},{
	            		text: '100K Labels',
	            		checked: true,
	            		leaf: true,
	            		subId: 1
	            	},{
	            		text: '63K Index (AK)',
	            		checked: true,
	            		leaf: true,
	            		subId: 2
	            	},{
	            		text: '63K Labels',
	            		checked: true,
	            		leaf: true,
	            		subId: 3
	            	},{
	            		text: '24K Index',
	            		checked: true,
	            		leaf: true,
	            		subId: 4
	            	},{
	            		text: '24K Labels',
	            		checked: true,
	            		leaf: true,
	            		subId: 5
	            	}]
	            },{
	            	text: 'Hydrography (NHD)',
	                checked: false,
	                layerId: 29325,
	                children: [{
	                	text: 'Hydrologic Units',
	                	checked: false,
	                	children: [{
	                		text: 'Regions',
		                	checked: true,
	                		leaf: true,
	                		subId: 1
	                	},{
	                		text: 'Regions Labels',
	                		leaf: true,
		                	checked: true,
	                		subId: 2
	                	},{
	                		text: 'Subregions',
	                		leaf: true,
		                	checked: true,
	                		subId: 3
	                	},{
	                		text: 'Subregions Labels',
	                		leaf: true,
		                	checked: true,
	                		subId: 4
	                	},{
	                		text: 'Basins',
	                		leaf: true,
		                	checked: true,
	                		subId: 5
	                	},{
	                		text: 'Basins Labels',
	                		leaf: true,
		                	checked: true,
	                		subId: 6
	                	},{
	                		text: 'Subbasins Small Scale',
	                		leaf: true,
		                	checked: true,
	                		subId: 7
	                	},{
	                		text: 'Subbasins Large Scale',
	                		leaf: true,
		                	checked: true,
	                		subId: 8
	                	},{
	                		text: 'Subbasins Labels',
	                		leaf: true,
		                	checked: true,
	                		subId: 9
	                	},{
	                		text: 'Watersheds',
	                		leaf: true,
		                	checked: true,
	                		subId: 10
	                	},{
	                		text: 'Subwatersheds',
	                		leaf: true,
		                	checked: true,
	                		subId: 11
	                	}]
	                },{
	                	text: 'Medium Resolution',
	                	checked: false,
	                	children: [{
	                		text: 'Point',
	                		leaf: true,
		                	checked: true,
	                		subId: 13
	                	},{
	                		text: 'Point Labels',
	                		leaf: true,
		                	checked: true,
	                		subId: 14
	                	},{
	                		text: 'Waterbody',
	                		leaf: true,
		                	checked: true,
	                		subId: 15
	                	},{
	                		text: 'Waterbody Labels',
	                		leaf: true,
		                	checked: true,
	                		subId: 16
	                	},{
	                		text: 'Area',
	                		leaf: true,
		                	checked: true,
	                		subId: 17
	                	},{
	                		text: 'Area Labels',
	                		leaf: true,
		                	checked: true,
	                		subId: 18
	                	},{
	                		text: 'Flowline',
	                		leaf: true,
		                	checked: true,
	                		subId: 19
	                	},{
	                		text: 'Flowline Labels',
	                		leaf: true,
		                	checked: true,
		                	subId: 20
	                	},{
	                		text: 'Line',
	                		leaf: true,
		                	checked: true,
	                		subId: 21
	                	},{
	                		text: 'Line Labels',
	                		leaf: true,
		                	checked: true,
	                		subId: 22
	                	}]
	                },{
	                	text: 'High Resolution',
	                	checked: false,
	                	children: [{
	                		text: 'Point',
	                		leaf: true,
		                	checked: true,
	                		subId: 24
	                	},{
	                		text: 'Point Labels',
	                		leaf: true,
		                	checked: true,
	                		subId: 25
	                	},{
	                		text: 'Point Event',
	                		leaf: true,
		                	checked: true,
	                		subId: 26
	                	},{
	                		text: 'Waterbody',
	                		leaf: true,
		                	checked: true,
	                		subId: 27
	                	},{
	                		text: 'Waterbody Labels',
	                		leaf: true,
		                	checked: true,
		                	subId: 28
	                	},{
	                		text: 'Area',
	                		leaf: true,
		                	checked: true,
	                		subId: 29
	                	},{
	                		text: 'Area Labels',
	                		leaf: true,
		                	checked: true,
	                		subId: 30
	                	},{
	                		text: 'Flowline',
	                		leaf: true,
		                	checked: true,
	                		subId: 31
	                	},{
	                		text: 'Flowline Labels',
	                		leaf: true,
		                	checked: true,
	                		subId: 32
	                	},{
	                		text: 'Line',
	                		leaf: true,
		                	checked: true,
		                	subId: 33
	                	},{
	                		text: 'Line Labels',
	                		leaf: true,
		                	checked: true,
	                		subId: 34
	                	}]
	                },{
	                	text: 'Local Resolution',
	                	checked: false,
	                	children: [{
	                		text: 'Point',
	                		leaf: true,
		                	checked: true,
	                		subId: 36
	                	},{
	                		text: 'Point Labels',
	                		leaf: true,
		                	checked: true,
	                		subId: 37
	                	},{
	                		text: 'Waterbody',
	                		leaf: true,
		                	checked: true,
	                		subId: 38
	                	},{
	                		text: 'Waterbody Labels',
	                		leaf: true,
		                	checked: true,
	                		subId: 39
	                	},{
	                		text: 'Area',
	                		leaf: true,
		                	checked: true,
	                		subId: 40
	                	},{
	                		text: 'Area Labels',
	                		leaf: true,
		                	checked: true,
	                		subId: 41
	                	},{
	                		text: 'Flowline',
	                		leaf: true,
		                	checked: true,
	                		subId: 42
	                	},{
	                		text: 'Flowline Labels',
	                		leaf: true,
		                	checked: true,
	                		subId: 43
	                	},{
	                		text: 'Line',
	                		leaf: true,
		                	checked: true,
	                		subId: 44
	                	},{
	                		text: 'Line Labels',
	                		leaf: true,
		                	checked: true,
	                		subId: 45
	                	}]
	                }]
	            },{
	            	text: 'Contours Beta (Small Scale)',
	            	checked: false,
	            	layerId: 29337,
	            	type: 'tiled',
	            	children: [{
	            		text: 'Small Scale - 250k (100 foot)',
            			leaf: true
	            	},{
	            		text: 'Mid Scale - 100k (50 foot)',
            			leaf: true
	            	}]
	            },{
	            	text: 'Large Scale Shaded Relief',
	            	checked: false,
	            	layerId: 29338,
	            	children: [{
	            		text: 'NED_1',
	            		subId: 0,
	            		leaf: true,
	            		checked: true
	            	},{
	            		text: 'NED_13',
	            		subId: 1,
	            		leaf: true,
	            		checked: true
	            	},{
	            		text: 'NED_1_AK_2',
	            		subId: 2,
	            		leaf: true,
	            		checked: true
	            	},{
	            		text: 'NED_13_HI_TI',
	            		subId: 3,
	            		leaf: true,
	            		checked: true
	            	}]
	            },{
	            	text: 'Large Scale Imagery',
	            	checked: false,
	            	layerId: 29338,
	            	children: [{
	            		text: '1 Meter Imagery',
	            		subId: 0,
	            		leaf: true,
	            		checked: true
	            	}]
	            },{
	            	text: 'Scanned Maps (Beta)',
	            	checked: false,
	            	layerId: 29336,
	            	children: [{
	            		text: 'USGS_EDC_Ortho_DRG (Large - 289k)',
	            		checked: true,
	            		subId: 0,
	            		leaf: true
	            	}]
	            }]
	        })
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
				map1.setMouseAction(identifyPoint);
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
		ntlAquiferName: getUrlParamStringFromPicklist('ntlAquifer', true)
	};

	map1.layerManager.unloadMapLayer(-95);
	map1.appendLayer(new JMap.web.mapLayer.WMSLayer({
		name: 'Data Layer',
		title: 'GW Data Well',
		description: 'Groundwater Data Well',
		id: -95,
		baseUrl: 'mvwms',
		srs: 3785,
		overlap: 10,
		zDepth: -900000,
		isHiddenFromUser: true,
		customParams: mapState
	}));	
}

function findParentMapLayer(n) {
	if (n.attributes.layerId) {
		return map1.getMapLayer(n.attributes.layerId);
	}	
	return findParentMapLayer(n.parentNode);
}


function refreshSubLayers(n, layerId) {
	var ml = map1.getMapLayer(layerId);
	if (n.isLeaf()) {
		if (n.ui.isChecked()) {
			ml.appendSubLayer(n.attributes.subId);
		} else {
			ml.removeSubLayer(n.attributes.subId);
		}
	} else if (!n.attributes.layerId) {
		for (var i = 0; i < n.childNodes.length; i++) {
			if (n.ui.isChecked() && n.childNodes[i].ui.isChecked()) {
				ml.appendSubLayer(n.childNodes[i].attributes.subId);
			} else {
				ml.removeSubLayer(n.childNodes[i].attributes.subId);
			}
    		ml.draw();
		}
	}
}

function loadMapLayers() {
	map1.loadMapLayer(new JMap.web.mapLayer.MultiServiceLayer({
		id: 29321,
		name: 'Satellite Imagery',
		description: 'Some photos from outer space',
		title: 'Satellite Imagery',
		legendUrl: 'http://raster1.nationalmap.gov/ArcGIS/rest/services/TNM_Small_Scale_Imagery/MapServer/tile/0/0/0.jpg',
		layers: [
		    new JMap.web.mapLayer.NationalMapTileLayer({
		    	id: 30001,
		    	zDepth: -50000,
		    	minZoom: 0,
		    	maxZoom: 11,
		    	format: 'jpg',
		    	baseUrl: 'http://raster1.nationalmap.gov/ArcGIS/rest/services/TNM_Small_Scale_Imagery/MapServer/tile'
		    }),	
		    new JMap.web.mapLayer.NationalMapWMSLayer({
		    	id: 30002,
		    	zDepth: -50000,
		    	minZoom: 12,
		    	maxZoom: 18,
		    	baseUrl: 'http://raster.nationalmap.gov/ArcGIS/rest/services/Combined/TNM_Large_Scale_Imagery/MapServer/export'
		    })
		]
	}));
	
	map1.appendLayer(new JMap.web.mapLayer.MultiServiceLayer({
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
	
	map1.loadMapLayer(new JMap.web.mapLayer.MultiServiceLayer({
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
	
	
	map1.appendLayer(new JMap.web.mapLayer.MultiServiceLayer({
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
	}));
		
		
	//http://services.nationalmap.gov/ArcGIS/rest/services/nhd/MapServer/export
	map1.loadMapLayer(new JMap.web.mapLayer.NationalMapWMSLayer({
		id: 29325,
    	zDepth: -450000,
		name: 'National Hydrography Dataset',
		description: 'The National Hydrography Dataset (NHD) is a comprehensive set of digital spatial data that encodes information about naturally occurring and constructed bodies of surface water (lakes, ponds, and reservoirs), paths through which water flows (canals, ditches, streams, and rivers), and related entities such as point features (springs, wells, stream gages, and dams). The information encoded about these features includes classification and other characteristics, delineation, geographic name, position and related measures, a "reach code" through which other information can be related to the NHD, and the direction of water flow. The network of reach codes delineating water and transported material flow allows users to trace movement in upstream and downstream directions. In addition to this geographic information, the dataset contains metadata that supports the exchange of future updates and improvements to the data. The NHD is available nationwide in two seamless datasets, one based on 1:24,000-scale maps and referred to as high resolution NHD, and the other based on 1:100,000-scale maps and referred to as medium resolution NHD. Additional selected areas in the United States are available based on larger scales, such as 1:5,000-scale or greater, and referred to as local resolution NHD. The NHD supports many applications, such as making maps, geocoding observations, flow modeling, data maintenance and stewardship. For additional information, go to http://nhd.usgs.gov/index.html and http://nhdgeo.usgs.gov/Metadata/NHDStatus.htm.',
		title: 'National Hydrography Dataset',
		legendUrl: 'http://services.nationalmap.gov/ArcGIS/rest/services/nhd/MapServer/export?f=image&dpi=96&transparent=true&format=png8&bbox={%22xmin%22:-20037508.342789244,%22ymin%22:-20037508.342789236,%22xmax%22:20037508.342789244,%22ymax%22:20037508.342789244,%22spatialReference%22:{%22wkid%22:102113}}&bboxSR=102113&imageSR=102113&size=256,256',
		baseUrl: 'http://services.nationalmap.gov/ArcGIS/rest/services/nhd/MapServer/export'
	}));
	
	
	map1.loadMapLayer(new JMap.web.mapLayer.NationalMapWMSLayer({
		id: 29330,
    	zDepth: -440000,
		name: 'Transportation',
		description: 'Transportation data consists of roads, airports, railroads, and other features associated with the transport of people or commerce. The data includes the location, classification, name or route designator, and for most roads, address ranges. Transportation data support mapping and geographic analysis for applications such as routing and navigation, traffic safety, congestion mitigation, disaster planning, and emergency response. For additional information, go to http://nationalmap.gov/transport.html.',
		title: 'Transportation',
		//legendUrl: 'http://services.nationalmap.gov/ArcGIS/rest/services/nhd/MapServer/export?f=image&dpi=96&transparent=true&format=png8&bbox={%22xmin%22:-20037508.342789244,%22ymin%22:-20037508.342789236,%22xmax%22:20037508.342789244,%22ymax%22:20037508.342789244,%22spatialReference%22:{%22wkid%22:102113}}&bboxSR=102113&imageSR=102113&size=256,256',
		baseUrl: 'http://services.nationalmap.gov/ArcGIS/rest/services/transportation/MapServer/export'
	}));
	

	map1.loadMapLayer(new JMap.web.mapLayer.NationalMapWMSLayer({
		id: 29331,
    	zDepth: -440000,
    	minZoom: 8,
		name: 'Available US Topography',
		description: 'Same data as the US Topo footprints at http://store.usgs.gov using the Map Locator, and updated on a daily basis.',
		title: 'Available US Topography',
		//legendUrl: 'http://services.nationalmap.gov/ArcGIS/rest/services/nhd/MapServer/export?f=image&dpi=96&transparent=true&format=png8&bbox={%22xmin%22:-20037508.342789244,%22ymin%22:-20037508.342789236,%22xmax%22:20037508.342789244,%22ymax%22:20037508.342789244,%22spatialReference%22:{%22wkid%22:102113}}&bboxSR=102113&imageSR=102113&size=256,256',
		baseUrl: 'http://services.nationalmap.gov/ArcGIS/rest/services/US_Topo/MapServer/export'
	}));


	map1.loadMapLayer(new JMap.web.mapLayer.NationalMapWMSLayer({
		id: 29332,
    	zDepth: -440000,
    	minZoom: 9,
		name: 'Geographic Names (GNIS)',
		description: 'The U.S. National Map Gazetteer is the Federal and national standard (ANSI INCITS 446-2008) for geographic nomenclature based on the Geographic Names Information System (GNIS). The Gazetteer contains information about physical and cultural geographic features, geographic areas, and locational entities that are generally recognizable and locatable by name (i.e., have achieved some landmark status) and are of interest to any level of government or to the public for any purpose that would lead to the representation of the feature in printed or electronic maps and/or geographic information systems. The dataset includes features of all types in the United States, associated areas, and Antarctica, current and historical, but not including roads and highways. The dataset holds the federally recognized name of each feature and defines the feature location by State, county, USGS topographic map, and geographic coordinates. Other attributes include names or spellings other than the official name, feature classification, and historical and descriptive information. The dataset assigns a unique, permanent feature identifier, the Feature ID, as a standard Federal key for accessing, integrating, or reconciling feature data from multiple data sets. This dataset is a flat model, establishing no relationships between featuresÑhierarchical, spatial, jurisdictional, organizational, administrative, or in any other manner. As an integral part of The National Map, the Gazetteer collects data from a broad program of partnerships with Federal, State, and local government agencies and other authorized contributors. The Gazetteer provides data to all levels of government and to the public, as well as to numerous applications through a web query site, web map, feature, and XML services, file download services, and customized files upon request. For additional information, go to http://geonames.usgs.gov/domestic/.',
		title: 'Geographic Names (GNIS)',
		//legendUrl: 'http://services.nationalmap.gov/ArcGIS/rest/services/nhd/MapServer/export?f=image&dpi=96&transparent=true&format=png8&bbox={%22xmin%22:-20037508.342789244,%22ymin%22:-20037508.342789236,%22xmax%22:20037508.342789244,%22ymax%22:20037508.342789244,%22spatialReference%22:{%22wkid%22:102113}}&bboxSR=102113&imageSR=102113&size=256,256',
		baseUrl: 'http://services.nationalmap.gov/ArcGIS/rest/services/geonames/MapServer/export'
	}));
	
	map1.loadMapLayer(new JMap.web.mapLayer.NationalMapWMSLayer({
		id: 29333,
    	zDepth: -440000,
		name: 'Structures',
		description: 'Structures data include the location, function, name, and other core information and characteristics of manmade facilities. Types of structures collected are largely determined by the needs of disaster planning and emergency response organizations. For additional information, go to http://nationalmap.gov/structures.html.',
		title: 'Structures',
		//legendUrl: 'http://services.nationalmap.gov/ArcGIS/rest/services/nhd/MapServer/export?f=image&dpi=96&transparent=true&format=png8&bbox={%22xmin%22:-20037508.342789244,%22ymin%22:-20037508.342789236,%22xmax%22:20037508.342789244,%22ymax%22:20037508.342789244,%22spatialReference%22:{%22wkid%22:102113}}&bboxSR=102113&imageSR=102113&size=256,256',
		baseUrl: 'http://services.nationalmap.gov/ArcGIS/rest/services/structures/MapServer/export'
	}));
	
	
	map1.loadMapLayer(new JMap.web.mapLayer.NationalMapWMSLayer({
		id: 29334,
    	zDepth: -440000,
		name: 'Governmental Unit Boundaries',
		description: 'Governmental Unit Boundaries data represent major civil areas including counties, States, Territories, Federal, and Native American lands, and incorporated places such as cities and towns. Boundaries data are useful for understanding the extent of jurisdictional or administrative areas for a wide range of applications, including managing resources and responding to natural disasters. Boundaries data also include extents of forest, grassland, park, wilderness, and wildlife areas useful for recreational activities, such as hiking and backpacking. For Governmental Unit Boundaries data, the information has been acquired from a variety of government sources. The data represent the source data with minimal editing or review by the USGS to assure proper data integration or adherence to legal descriptions. Please refer to the feature-level metadata for information on the data source. For additional information, go to http://nationalmap.gov/boundaries.html.',
		title: 'Governmental Unit Boundaries',
		//legendUrl: 'http://services.nationalmap.gov/ArcGIS/rest/services/nhd/MapServer/export?f=image&dpi=96&transparent=true&format=png8&bbox={%22xmin%22:-20037508.342789244,%22ymin%22:-20037508.342789236,%22xmax%22:20037508.342789244,%22ymax%22:20037508.342789244,%22spatialReference%22:{%22wkid%22:102113}}&bboxSR=102113&imageSR=102113&size=256,256',
		baseUrl: 'http://services.nationalmap.gov/ArcGIS/rest/services/govunits/MapServer/export'
	}));
	
	
	map1.loadMapLayer(new JMap.web.mapLayer.NationalMapWMSLayer({
		id: 29335,
    	zDepth: -440000,
    	minZoom: 5,
		name: 'Map Indices',
		description: 'Polygons used in the National Map Viewer to download data, containing the 100k, 24k, and 63k (for Alaska) reference grids. ',
		title: 'Map Indices',
		//legendUrl: 'http://services.nationalmap.gov/ArcGIS/rest/services/nhd/MapServer/export?f=image&dpi=96&transparent=true&format=png8&bbox={%22xmin%22:-20037508.342789244,%22ymin%22:-20037508.342789236,%22xmax%22:20037508.342789244,%22ymax%22:20037508.342789244,%22spatialReference%22:{%22wkid%22:102113}}&bboxSR=102113&imageSR=102113&size=256,256',
		baseUrl: 'http://services.nationalmap.gov/ArcGIS/rest/services/map_indices/MapServer/export'
	}));
	
	map1.loadMapLayer(new JMap.web.mapLayer.NationalMapTileLayer({
		id: 29337,
    	zDepth: -440000,
    	format: 'png',
		name: 'Contours Beta - (Small Scale)',
		description: 'The National Elevation Dataset (NED) is the primary elevation data product of the USGS. The NED provides seamless raster elevation data of the conterminous United States, Alaska, Hawaii, and U.S. Territories. The NED is derived from diverse source datasets that are processed to a specification with a consistent resolution, coordinate system, elevation units, and horizontal and vertical datums. The NED is the logical result of the maturation of the long-standing USGS elevation program, which for many years concentrated on production of topographic map quadrangle-based digital elevation models. The NED serves as the elevation layer of The National Map, and provides basic elevation information for earth science studies and mapping applications in the United States. Scientists and resource managers use NED data for global change research, hydrologic modeling, resource monitoring, mapping and visualization, and many other applications. For additional information, go to http://ned.usgs.gov. This layer contains 100-foot contours at 1:288,895 and 1:144,448 and 50-foot contours at 1:72,224. ',
		title: 'Contours Beta - (Small Scale)',
		//legendUrl: 'http://services.nationalmap.gov/ArcGIS/rest/services/nhd/MapServer/export?f=image&dpi=96&transparent=true&format=png8&bbox={%22xmin%22:-20037508.342789244,%22ymin%22:-20037508.342789236,%22xmax%22:20037508.342789244,%22ymax%22:20037508.342789244,%22spatialReference%22:{%22wkid%22:102113}}&bboxSR=102113&imageSR=102113&size=256,256',
		baseUrl: 'http://basemap.nationalmap.gov/ArcGIS/rest/services/TNM_Contours_Small/MapServer/tile'
	}));
	
//	http://services.nationalmap.gov/ArcGIS/rest/services/Scanned_Maps/MapServer/export
	map1.loadMapLayer(new JMap.web.mapLayer.NationalMapWMSLayer({
		id: 29336,
    	zDepth: -340000,
    	minZoom: 11,
		name: 'Scanned Maps',
		description: 'Scanned Maps',
		title: 'Scanned Maps',
		//legendUrl: 'http://services.nationalmap.gov/ArcGIS/rest/services/nhd/MapServer/export?f=image&dpi=96&transparent=true&format=png8&bbox={%22xmin%22:-20037508.342789244,%22ymin%22:-20037508.342789236,%22xmax%22:20037508.342789244,%22ymax%22:20037508.342789244,%22spatialReference%22:{%22wkid%22:102113}}&bboxSR=102113&imageSR=102113&size=256,256',
		baseUrl: 'http://services.nationalmap.gov/ArcGIS/rest/services/Scanned_Maps/MapServer/export'
	}));
	
	
	//http://raster.nationalmap.gov/ArcGIS/rest/services/TNM_Large_Scale_Shaded_Relief/MapServer/export
	map1.loadMapLayer(new JMap.web.mapLayer.NationalMapWMSLayer({
		id: 29338,
    	zDepth: -150000,
		name: 'Large Scale Shaded Relief',
		description: 'The USGS National Elevation Dataset (NED) has been developed by merging the highest resolution, best-quality elevation data available across the United States into a seamless raster format. NED is the result of the maturation of the USGS effort to provide 1:24,000-scale digital elevation model (DEM) data for the conterminous United States, and 1:63,360-scale DEM data for Alaska. NED data are available nationally at grid spacings of 1 arc-second (approximately 30 meters) for the conterminous United States, and at 1/3 and 1/9 arc-seconds (approximately 10 meters and 3 meters, respectively) for parts of the U.S. For additional information, go to http://ned.usgs.gov. This layer is derived from the NED using a hill-shade technique, and is a continental view showing shaded relief generated from full-resolution USGS NED layers, at 1/3, 1, and 2 arc-second cell sizes. Shaded relief (hill-shade function) parameters are: Point illumination is from the NW (Azimuth = 315 degrees); the altitude of the light source is 45 degrees; and a multiplier of 0.00005 was used to limit the range of the resulting numbers. Color characteristics are the result of applying a color ramp in which the RGB values range from white (RGB: 255, 255, 255) to brown (RGB: 130, 66, 30). The color ramp was applied with a 3 standard deviation stretch. Finally, a transparency value of 60% was used to soften the image for cartographic purposes.',
		title: 'Large Scale Shaded Relief',
		//legendUrl: 'http://services.nationalmap.gov/ArcGIS/rest/services/nhd/MapServer/export?f=image&dpi=96&transparent=true&format=png8&bbox={%22xmin%22:-20037508.342789244,%22ymin%22:-20037508.342789236,%22xmax%22:20037508.342789244,%22ymax%22:20037508.342789244,%22spatialReference%22:{%22wkid%22:102113}}&bboxSR=102113&imageSR=102113&size=256,256',
		baseUrl: 'http://services.nationalmap.gov/ArcGIS/rest/services/Scanned_Maps/MapServer/export'
	}));
	
	map1.loadMapLayer(new JMap.web.mapLayer.NationalMapWMSLayer({
		id: 29339,
    	zDepth: -150000,
		name: 'Large Scale Imagery',
		description: 'Orthoimagery data are typically high resolution aerial images that combine the visual attributes of an aerial photograph with the spatial accuracy and reliability of a map. Digital orthoimage resolution may vary from 6 inches to 1 meter. In the former resolution, every pixel in an orthoimage covers a six inch square of the earthÕs surface, while in the latter resolution, one meter square is represented by each pixel. The National Map allows free downloads of public domain, 1-meter orthoimagery for the conterminous United States, with many urban areas and other locations at 2-feet or finer resolution. Many States contribute orthoimagery to The National Map, and the USGS also relies on a partnership with the U.S. Department of AgricultureÕs Farm Service Agency. For additional information, go to http://gisdata.usgs.net/website/Orthoimagery/. This layer is a mosaic of 1-meter resolution natural color and color infrared aerial imagery, and contains National Agriculture Imagery Program data and other sources to complete the mosaic.',
		title: 'Large Scale Imagery',
		//legendUrl: 'http://services.nationalmap.gov/ArcGIS/rest/services/nhd/MapServer/export?f=image&dpi=96&transparent=true&format=png8&bbox={%22xmin%22:-20037508.342789244,%22ymin%22:-20037508.342789236,%22xmax%22:20037508.342789244,%22ymax%22:20037508.342789244,%22spatialReference%22:{%22wkid%22:102113}}&bboxSR=102113&imageSR=102113&size=256,256',
		baseUrl: 'http://raster.nationalmap.gov/ArcGIS/rest/services/Combined/TNM_Large_Scale_Imagery/MapServer/export'
	}));
}