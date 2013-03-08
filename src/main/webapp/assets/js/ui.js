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
    
    var filterPanel = new Ext.Panel({ //container panel
    	layout: 'border',
    	region: 'west',
    	border: false,
		collapsible: true,
		collapseMode: 'mini',
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
				title: 'Filter Sites',
				autoScroll: true,
				buttonAlign: 'center',
				border: true,
				layout: 'accordion',
				animate: true,
				items: [{
					title: 'NGWMN Networks',
					padding: 5,
					items: [{ //water level sub container
							xtype: "panel",
							layout: 'form',
							border: false,
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
					title: 'Principal Aquifer',
					xtype: "panel",
					layout: 'form',
					labelWidth: 1, //required
					padding: 5,
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
					title: 'State and County',
					xtype: "panel",
					layout: 'form',
					padding: 5,
					autoScroll: true,
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
				}
				]
			},{ //panel for stats
				xtype: 'panel',
				region: 'south',
				border: false,
				height: 75,
				padding: 5,
				bodyStyle: "background-color: transparent",
				defaults: {
					bodyStyle: "background-color: transparent; text-align: center; font-size: small;",
					border: false
				},
				items: [GWDP.ui.pointsCount,GWDP.ui.waterLevelCount,GWDP.ui.waterQualityCount
				]
			}        
    	]
    });
    
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
							id: 'help',
							qtip: 'Get Help',
							handler: showHelp
						},{
							id: 'restore',
							qtip: 'Restore',
					        handler: minimize
						},{
							id: 'maximize',
							qtip: 'Maximize',
					        handler: maximize
						}
					],
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

Ext.onReady(GWDP.ui.initApp);
