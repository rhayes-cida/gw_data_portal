GWDP.ui.initApp = function() {
		
	var showHelp = function(event, toolEl, panel,tc) {
		var myWin = Ext.create({
			title: 'NGWMN Help',
			xtype: 'window',
			modal: true,
			html: '<iframe src="https://my.usgs.gov/confluence/display/ngwmn/NGWMN+Data+Portal+Help" width="100%" height="100%" ></iframe>',
			width: 970,
			height: 600
		});
		myWin.show();
    };
    
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
			layout: 'fit',
		    items: [{
				title: 'Click and drag map',
				border: false,
				id: 'ext-map-area',
				contentEl: 'map-area',
				layout: 'fit',
				tools: [
						{
							id: 'refresh',
							qtip: 'Refresh',
					        handler: function() {alert("not yet implemented");}
						},
						{
							id: 'help',
							qtip: 'Get Help',
							handler: showHelp
						}
					]
				,listeners: {
					afterrender: GWDP.ui.initMap,
					resize: function(p,w,h) {
						if(GWDP.ui.map.mainMap) {
							GWDP.ui.map.mainMap.updateSize();
						}
					}
//					,resize: function(p) {
//						if (map1) map1.resize(p.body.getWidth(),p.getInnerHeight());
//					}
				}
		    
		    }],
			bbar: [GWDP.ui.pointsCount]
		},{
			region: 'west',
			width: 300,
			title: 'Filter Map Data',
			bodyStyle: 'padding: 5px',
			autoScroll: true,
			buttonAlign: 'center',
			buttons: [{
				text: 'Map',
				handler: function() {alert("not yet implemented");}
			}],
			tools: [
					{
						id: 'refresh',
						qtip: 'Refresh',
				        handler: function() {alert("not yet implemented");}
					},
			{
				id: 'help',
		        qtip: 'Get Help',
		        handler: showHelp
			}
			],

			items: [{
				xtype: 'fieldset',
				title: 'Agency Contributing Data',
				contentEl: 'agency-div'
			},{
				xtype: 'fieldset',
				title: 'U.S. Principal Aquifer Name',
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
	
	//TODO get some controls on the map
	
	//loadMapLayers(); //TODO load geoserver layers	
};

Ext.onReady(GWDP.ui.initApp);
