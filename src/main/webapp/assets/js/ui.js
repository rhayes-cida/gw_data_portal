GWDP.ui.SKIP_TIPS_COOKIENAME = "cida-ngwmn-skip-tips";

GWDP.ui.showHelpTips = function(){
	Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
	if(Ext.state.Manager.get(GWDP.ui.SKIP_TIPS_COOKIENAME, "false")!="true") {
		var tips = Ext.create({
			title: 'Welcome to the NGWMN Data Portal!',
			xtype: 'window',
			modal: true,
			html: 'Some help tips here',
			bbar: [{
				xtype: 'checkbox',
				boxLabel: "Don't show me this again",
				listeners:{
					check: function(cb, checked) {
						if(checked) {
							Ext.state.Manager.set(GWDP.ui.SKIP_TIPS_COOKIENAME, "true");
						} else {
							Ext.state.Manager.clear(GWDP.ui.SKIP_TIPS_COOKIENAME);
						}
					}
				}
			}],
			width: 400,
			height: 300
		});
		tips.show();
	}
};


GWDP.ui.initApp = function() {
	
	//header and footer panels
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
    
    var minimize = function() {
    	header.expand(false);
    	footer.expand(false);
    };
    
    var maximize = function() {
    	header.collapse(true);
    	footer.collapse(true);
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
						},{
							id: 'minimize',
							qtip: 'Minimize',
					        handler: minimize
						},{
							id: 'maximize',
							qtip: 'Maximize',
					        handler: maximize
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
	
	//put together the viewport
	new Ext.Viewport({
		id: 'gwdp-viewport',
		layout: 'border',
		items: [header, content, footer]
	});
	
	//TODO get some controls on the map
	
	//loadMapLayers(); //TODO load geoserver layers	
	GWDP.ui.showHelpTips();
};


Ext.onReady(GWDP.ui.initApp);
