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
	var content = new Ext.Panel({
		id: 'content',
		region: 'center',
		layout: 'border',
		plain: true,
		style: 'text-align: left',
		border: false,
		items: [{
				title: 'Click and drag map',
				region: 'center',
				border: true,
				id: 'cmp-map-area',
				contentEl: 'map-area',
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
				listeners: {
					afterrender: GWDP.ui.initMap,
					resize: function(p,w,h) {
						if(GWDP.ui.map.mainMap) {
							GWDP.ui.map.mainMap.updateSize();
						}
					}
				},
				bbar: [GWDP.ui.pointsCount]
		    },{
				region: 'west',
				width: 300,
				title: 'Filter Map Data',
				bodyStyle: 'padding: 5px',
				autoScroll: true,
				buttonAlign: 'center',
				border: true,
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
	
	var header = new Ext.Panel({ //header
		region: 'north',
		border: false,
		contentEl: 'header',
		height: 103,
		collapsible: true,
		collapseMode: 'mini',
		split: true,
		hideCollapseTool: true,
		useSplitTips: true,
		collapsibleSplitTip: 'Click here to hide the top panel.'
	});
	
	var footer = new Ext.Panel({ //footer
		region: 'south',
		contentEl: 'footer',
		layout: 'fit',
		border: false,
		collapsible: true,
		collapseMode: 'mini',
		split: true,
		hideCollapseTool: true,
		useSplitTips: true,
		collapsibleSplitTip: 'Click here to hide the bottom panel.',
		height: 125,
		minSize: 110
	});
	
	//put together the viewport
	new Ext.Viewport({
		id: 'gwdp-viewport',
		layout: 'border',
		items: [header, content, footer]
	});
	
	//TODO get some controls on the map
	
	//loadMapLayers(); //TODO load geoserver layers	
	
	
};

Ext.onReady(GWDP.ui.initApp);
