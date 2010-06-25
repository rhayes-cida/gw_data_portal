var map;

Ext.onReady(function() {
	
	
	map1 = new JMap.web.Map({
		containerEl: 'map-area',
		numTilesX: 7,
		numTilesY: 5,
		centerLat: 37,
		centerLon: -96,
		zoomLevel: 3,
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
		height: 1300,
		width: 800,
		border: false,
		plain: true,
		style: 'text-align: left',
		items: [{
			region: 'center',
			id: 'application-area',
			layout: 'border',
			border: false
		},{
			region: 'west',
			width: 300,
			items: [{
				xtype: 'fieldset',
				title: 'Organization ID',
				contentEl: 'orgId-div'
			},{
				xtype: 'fieldset',
				title: 'Well Monitoring Purpose Type',
				contentEl: 'wellMonitoring-div'
			},{
				xtype: 'fieldset',
				title: 'National Aquifer Name',
				contentEl: 'ntlAquifer-div'
			}]
		}]
	});
});