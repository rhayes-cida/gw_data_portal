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
		projection: new JMap.projection.PlateCarree(),
		HUD: {
			zoomSlider: true, 
			scaleRake: true
		},
		layersFile: {
			url: 'assets/wms/wms_default.xml'
		}
	});
	
	//create the EXTJS layout
	new Ext.Panel({
		id: 'ext-content-panel',
		renderTo: 'content',
		layout: 'border',
		height: 630,
		width: 1050,
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
				title: 'QW Well Type',
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
		overlap: 10,
		zDepth: -900000,
		isHiddenFromUser: true,
		customParams: mapState
	}));	
}