GWDP.ui.SKIP_TIPS_COOKIENAME = "cida-ngwmn-skip-tips";

GWDP.ui.pointsCount = new Ext.Panel({ html: 'Calculating Sites Mapped...'});
GWDP.ui.waterLevelCount = new Ext.Panel({ html: 'Calculating Sites Mapped...'});
GWDP.ui.waterQualityCount = new Ext.Panel({ html: 'Calculating Sites Mapped...'});

GWDP.ui.initApp = function() {
	
	//header and footer panels
	var header = new Ext.Panel({ //header
		region: 'north',
		border: false,
		contentEl: 'header',
		height: 80,
		collapseMode: 'mini',
		hideCollapseTool: true,
		animCollapse: false,
		titleCollapse: true,
		listeners: {
			expand: GWDP.ui.updateMaximizeTool,
			collapse: GWDP.ui.updateMaximizeTool
		}
	});
	
	var footer = new Ext.Panel({ //footer
		region: 'south',
		contentEl: 'footer',
		layout: 'fit',
		border: false,
		collapseMode: 'mini',
		hideCollapseTool: true,
		animCollapse: false,
		height: 125,
		minSize: 110,
		listeners: {
			expand: GWDP.ui.updateMaximizeTool,
			collapse: GWDP.ui.updateMaximizeTool
		}
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
    
    var filterPanel = new Ext.Panel({ //container panel
    	layout: 'border',
    	region: 'west',
    	border: false,
		collapsible: true,
		collapseMode: 'mini',
		animCollapse: false,
		split: true,
		hideCollapseTool: true,
		useSplitTips: true,
		collapsibleSplitTip: 'Click here to hide the filter panel.',
    	width: 300,
    	items: [
			{
				xtype: 'form',
				id: 'gwdpFilters',
				region: 'center',
				autoScroll: true,
				buttonAlign: 'center',
				border: false,
				layout: 'accordion',
				animate: true,
				tools: [
		    	 		{
		    	 			id: 'info',
		    	 			handler: GWDP.ui.toggleHelpTips
		    	 		},{
		    	 			id: 'help',
		    	 			handler: showHelp
		    	 		},{
		    	 			id: 'maximize',
		    	 	        handler: GWDP.ui.toggleMaximized
		    	 		},{
		    	 			id: 'restore',
		    	 			hidden: true,
		    	 	        handler: GWDP.ui.toggleMaximized
		    	 		}
		    	 	],
				items: [{
					title: 'NGWMN NETWORKS',
					padding: 5,
					border: false,
					items: [{ //water level sub container
							xtype: "panel",
							layout: 'form',
							border: false,
							autoScroll: true,
							items: [{
									xtype: 'checkbox',
									fieldLabel: "<b>Water level</b>",
									value: '1',
									name: "WL_SN_FLAG",
									id: "WL_SN_FLAG",
									checked: true,
					            	listeners : { check: function() { GWDP.ui.getUpdateMap(); } }
								},{
						            xtype: 'multiselect',
						            fieldLabel: 'Subnetwork',
						            id: 'WL_WELL_CHARS',
						            name: 'WL_WELL_CHARS',
						            width: 150,
						            height: 'auto',
						            value: 'All',
						            store: [
											['All','All'],
						                    ['1','Background'],
						                    ['2','Suspected Changes'],
						                    ['3','Known Changes']
								            ],
						            ddReorder: true,
						            listeners: {
						            	change: function() { GWDP.ui.getUpdateMap(); }
						            }
						        },{
						            xtype: 'multiselect',
						            fieldLabel: 'Monitoring Category',
						            id: 'WL_WELL_TYPE',
						            name: 'WL_WELL_TYPE',
						            width: 150,
						            height: 'auto',
						            value: 'All',
						            store: [
											['All','All'],
						                    ['1','Surveillance'],
						                    ['2','Trend'],
						                    ['3','Special']
								            ],
						            ddReorder: true,
						            listeners: {
						            	change: function() { GWDP.ui.getUpdateMap(); }
						            }
						        }
							]
						}, { //water quality sub container
							xtype: "panel",
							layout: 'form',
							border: false,
							items: [{
									xtype: 'checkbox',
									fieldLabel: "<b>Water quality</b>",
									value: '1',
									name: "QW_SN_FLAG",
									id: "QW_SN_FLAG",
									checked: true,
					            	listeners : { check: function() { GWDP.ui.getUpdateMap(); } }
								},{
						            xtype: 'multiselect',
						            fieldLabel: 'Subnetwork',
						            id: 'QW_WELL_CHARS',
						            name: 'QW_WELL_CHARS',
						            width: 150,
						            height: 'auto',
						            value: 'All',
						            store: [
											['All','All'],
						                    ['1','Background'],
						                    ['2','Suspected Changes'],
						                    ['3','Known Changes']
								            ],
						            ddReorder: true,
						            listeners: {
						            	change: function() { GWDP.ui.getUpdateMap(); }
						            }
						        },{
						            xtype: 'multiselect',
						            fieldLabel: 'Monitoring Category',
						            id: 'QW_WELL_TYPE',
						            name: 'QW_WELL_TYPE',
						            width: 150,
						            height: 'auto',
						            value: 'All',
						            store: [
											['All','All'],
						                    ['1','Surveillance'],
						                    ['2','Trend'],
						                    ['3','Special']
								            ],
						            ddReorder: true,
						            listeners: {
						            	change: function() { GWDP.ui.getUpdateMap(); }
						            }
						        }
							]
						}
					]
				},{
					title: 'FILTER MAP DATA',
					layout: 'accordion',
					padding: 0,
					border: false,
					bodyCssClass: 'ngwmn-subfilter',
					items: [{
						title: 'Principal Aquifer',
						xtype: "panel",
						layout: 'form',
						labelWidth: 1, //required
						padding: 5,
						border: false,
						autoScroll: true,
						items: [{
				            xtype: 'multiselect',
				            id: 'principalAquifer',
				            name: 'principalAquifer',
				            width: 240,
				            height: 'auto',
				            allowBlank:true,
				            displayField: 'AQUIFER',
				            valueField: 'AQUIFERCODE',
				            value: "All",
				            store: GWDP.domain.Aquifer.getAquiferMetadata({}, function() { Ext.getCmp('principalAquifer').setValue('All'); }, "All"),
				            ddReorder: true,
				            listeners: {
				            	change: function() { GWDP.ui.getUpdateMap(); }
				            }
				        }]
					},{
						title: 'Available Data',
						xtype: "panel",
						layout: 'hbox',
						labelWidth: 1, //required
						padding: 5,
						border: false,
						autoScroll: true,
						items: [{
							xtype: 'checkbox',
							name: 'WL_DATA_FLAG',
							boxLabel: 'Water Level',
			            	listeners : { check: function() { GWDP.ui.getUpdateMap(); } }
						},{
							xtype: 'checkbox',
							name: 'QW_DATA_FLAG',
							boxLabel: 'Water Quality',
			            	listeners : { check: function() { GWDP.ui.getUpdateMap(); } }
						},{
							xtype: 'checkbox',
							name: 'LOG_DATA_FLAG',
							boxLabel: 'Well Log',
			            	listeners : { check: function() { GWDP.ui.getUpdateMap(); } }
						}]
					},{
						title: 'State and County',
						xtype: "panel",
						layout: 'form',
						padding: 5,
						autoScroll: true,
						border: false,
			            labelAlign: 'top',
			            labelWidth: 150,
						items: [{
							xtype: 'radio',
							boxLabel: "Multiple states",
							name: 'stateOrCountyRadio',
							checked: true
						},{
							xtype: 'radio',
							boxLabel: "One state, multiple counties",
							name: 'stateOrCountyRadio',
							checked: false,
							listeners: {
								check: function(r, checked) {
									GWDP.ui.toggleCountiesFilter(checked);
								}
							}
						},{
							xtype: "panel",
							border: false, 
							html: '<br/>'
						},{
				            xtype: 'multiselect',
				            fieldLabel: 'States',
				            id: 'states',
				            name: 'states',
				            width: 240,
				            height: 'auto',
				            allowBlank:true,
				            displayField: 'STATE_NM',
				            valueField: 'STATE_CD',
				            disabled: false,
				            value: "All",
				            store: GWDP.domain.State.getStateMetadata({}, function() { Ext.getCmp('states').setValue('All'); }, 'All'),
				            ddReorder: true,
				            listeners: {
				            	change: function() { GWDP.ui.getUpdateMap(); }
				            }
				        },{
				            xtpe: 'container',
				            id: 'countiesContainer',
				            layout: 'form',
				            border: false,
				            hidden: true,
				            labelAlign: 'top',
				            labelWidth: 150,
				            items: [{
				            	fieldLabel: "State",
					            xtype: 'combo',
					            id: 'statesCombo',
					            name: 'statesCombo',
					            hiddenName: "states",
					            triggerAction: 'all',
					            disabled: true, //this must be disabled if the other state filter is enabled
					            width: 240,
					            mode: 'local',
					            disableKeyFilter: true, 
					            displayField: 'STATE_NM',
					            valueField: 'STATE_CD',
					            value: "All",
					            typeAhead: false,
					            forceSelection: true,
					            store: GWDP.domain.State.getStateMetadata({}, function() { Ext.getCmp('statesCombo').setValue('All'); }, 'All'),
					            listeners: {
					            	select: function(c) {
					            		GWDP.ui.getUpdateMap();
					            		GWDP.ui.refreshCountiesFilter(c.getValue()); 
					            	},
					            	change: function(c) {
					            		GWDP.ui.getUpdateMap();
					            	}
					            }
					        },{
					        	fieldLabel: "Counties",
				            	xtype: 'multiselect',
					            id: 'counties',
					            name: 'counties',
					            width: 240,
					            height: 'auto',
					            allowBlank:true,
					            displayField: 'COUNTY_NM',
					            valueField: 'COUNTY_CD',
					            value: "All",
					            store: GWDP.domain.County.getCountyMetadata({}, function() { Ext.getCmp('counties').setValue('All'); }, 'All'),
					            ddReorder: true,
					            listeners: {
					            	change: function() { GWDP.ui.getUpdateMap(); }
					            }
				            }]
				        }]
					},{
						title: 'Contributing Agency',
						xtype: "panel",
						layout: 'form',
						padding: 5,
						border: false,
						autoScroll: true,
						labelWidth: 1,//required
						items: [{
				            xtype: 'multiselect',
				            id: 'contributingAgencies',
				            name: 'contributingAgencies',
				            width: 240,
				            height: 'auto',
				            allowBlank:true,
				            displayField: 'AGENCY_NM',
				            valueField: 'AGENCY_CD',
				            value: "All",
				            store: GWDP.domain.Agency.getAgencyMetadata({}, function() { Ext.getCmp('contributingAgencies').setValue('All'); }, 'All'),
				            ddReorder: true,
				            listeners: {
				            	change: function() { GWDP.ui.getUpdateMap(); }
				            }
				        }]
					}]
				}
				]
			},{ //panel for stats
				xtype: 'panel',
				region: 'south',
				border: false,
				height: 100,
				padding: 10,
				title: 'CURRENT VIEW',
				bodyCssClass: "ngwmn-currentview-panel",
				defaults: {
					bodyStyle: "background-color: transparent; text-align: left; font-size: x-small; font-weight: bold;",
					border: false
				},
				items: [GWDP.ui.pointsCount,GWDP.ui.waterLevelCount, GWDP.ui.waterQualityCount
				]
			}        
    	]
    });
    
	//create the EXTJS layout
	var content = new Ext.Panel({
		id: 'content',
		region: 'center',
		layout: 'border',
		plain: true,
		style: 'text-align: left',
		border: false,
		items: [{
				region: 'center',
				border: true,
				id: 'cmp-map-area',
				contentEl: 'map-area',
				listeners: {
					resize: function(p,w,h) {
						if(GWDP.ui.map.mainMap) {
							GWDP.ui.map.mainMap.updateSize();
						}
					}
				}
		    },
		    filterPanel]
	});
	
	
	//put together the viewport
	GWDP.ui.header = header;
	GWDP.ui.footer = footer;
	GWDP.ui.maxToolTip
	new Ext.Viewport({
		id: 'gwdp-viewport',
		layout: 'border',
		items: [header, content, footer],
		listeners: {
			afterrender: GWDP.ui.initMap
		}
	});
	
	GWDP.ui.help.initHelpTips();
};

GWDP.ui.getFilterFormValues = function() {
	return Ext.getCmp('gwdpFilters').getForm().getValues();
};

GWDP.ui.toggleCountiesFilter = function(searchCounties) {
	if(searchCounties) {
		Ext.getCmp('states').disable();
		Ext.getCmp('states').hide();
		Ext.getCmp('statesCombo').enable();
		Ext.getCmp('statesCombo').setValue('All');
		GWDP.ui.refreshCountiesFilter(Ext.getCmp('statesCombo').getValue());
		Ext.getCmp('countiesContainer').show();
	} else {
		Ext.getCmp('statesCombo').disable();
		Ext.getCmp('counties').setValue('All');
		Ext.getCmp('countiesContainer').hide();
		Ext.getCmp('states').enable();
		Ext.getCmp('states').show();
		Ext.getCmp('states').setValue('All');
	}
	GWDP.ui.getUpdateMap();
};

GWDP.ui.refreshCountiesFilter = function(stateCd) {
	if(stateCd=='All') stateCd = '0';
	GWDP.domain.County.updateCountyMetadata(Ext.getCmp('counties').store, {stateCd: stateCd}, function(s){
		Ext.getCmp('counties').setValue('All');
	 }, 'All');
};

//will block based on a buffer
GWDP.ui.blockBuffer = 0;
GWDP.ui.helpTipsOff = false;
GWDP.ui.toggleHelpTips = function() {
	GWDP.ui.helpTipsOff = !GWDP.ui.helpTipsOff;
	GWDP.ui.blockBuffer = 0;
    new Ext.ux.Notify({
		msg: ' Help tips are now ' + (GWDP.ui.helpTipsOff ? "off" : "on") + "."
	}).show(Ext.getCmp('cmp-map-area').getEl());
};

GWDP.ui.blockHelpTip = function(mod, offset) {
	if(GWDP.ui.helpTipsOff) return true;
	if(!offset) offset = 0;
	if(GWDP.ui.blockBuffer % mod == offset) return false; 
	return true;
};

GWDP.ui.showAHelpTip = function() {
	GWDP.ui.showZoomTip();
	GWDP.ui.showClickTip();
	GWDP.ui.showSiteSelectionTip();
	GWDP.ui.blockBuffer++;
};
GWDP.ui.tipFrequency = 10;

GWDP.ui.showSiteSelectionTip = function(force){
	if(force || GWDP.ui.blockHelpTip(GWDP.ui.tipFrequency, 6)) return;
	GWDP.ui.notify(' Ctrl + click to select a site. Hold Ctrl and drag a box to select a group of sites.');
};

GWDP.ui.showZoomTip = function(force){
	if(force || GWDP.ui.blockHelpTip(GWDP.ui.tipFrequency, 3)) return;
	GWDP.ui.notify(' Hold Shift & drag mouse to zoom into an area of interest.');
};

GWDP.ui.showClickTip = function(force){
	if(force || GWDP.ui.blockHelpTip(GWDP.ui.tipFrequency)) return;
	GWDP.ui.notify('Click a point on the map to identify a site.');
};

GWDP.ui.notify = function(msg) {
	new Ext.ux.Notify({
		msg: msg
	}).show(Ext.getCmp('cmp-map-area').getEl());
};

GWDP.ui.toggleMaximized = function() {
	var max = !GWDP.ui.header.collapsed || !GWDP.ui.footer.collapsed;
	if(max) {
		GWDP.ui.header.collapse(false);
		GWDP.ui.footer.collapse(false);
	} else {
		GWDP.ui.header.expand(false);
		GWDP.ui.footer.expand(false);
	}
	GWDP.ui.updateMaximizeTool();
};

GWDP.ui.updateMaximizeTool = function() {
	var restore = GWDP.ui.header.collapsed && GWDP.ui.footer.collapsed;
	var mapTools = Ext.getCmp('gwdpFilters').tools;
	if(restore) {
		mapTools.maximize.hide();
		mapTools.restore.show();
	} else {
		mapTools.maximize.show();
		mapTools.restore.hide();
	}
};

Ext.onReady(GWDP.ui.initApp);
