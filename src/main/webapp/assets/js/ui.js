GWDP.ui.SKIP_TIPS_COOKIENAME = "cida-ngwmn-skip-tips";

GWDP.ui.pointsCount = new Ext.Panel({ html: 'Calculating Points Mapped...'});
GWDP.ui.waterLevelCount = new Ext.Panel({ html: 'Calculating Points Mapped...'});
GWDP.ui.waterQualityCount = new Ext.Panel({ html: 'Calculating Points Mapped...'});

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
						            height: 85,
						            value: 'All',
						            store: [
											['All','All'],
						                    ['1','Surveillance'],
						                    ['2','Suspected / Anticipated Changes'],
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
						            height: 85,
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
						            height: 85,
						            value: 'All',
						            store: [
											['All','All'],
						                    ['1','Surveillance'],
						                    ['2','Suspected / Anticipated Changes'],
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
						            height: 85,
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
					title: 'Principle Aquifer',
					xtype: "panel",
					layout: 'form',
					labelWidth: 1, //required
					padding: 5,
					items: [{
						xtype: 'container',
						html: '*Data from any aquifer is shown if no selection is made'
					},{
			            xtype: 'multiselect',
			            id: 'principleAquifer',
			            name: 'principleAquifer',
			            width: 250,
			            height: 200,
			            allowBlank:true,
			            displayField: 'AQUIFER',
			            valueField: 'AQUIFERCODE',
			            store: GWDP.domain.Aquifer.getAquiferStore(),
			            tbar:[{
			                text: 'clear',
			                handler: function(){
				                Ext.getCmp('principleAquifer').reset();
				                GWDP.ui.getUpdateMap();
				            }
			            }],
			            ddReorder: true,
			            listeners: {
			            	added: function(c) {
			            		GWDP.domain.Aquifer.getAquiferMetadata(
			            			{},
			            			function(r){
			            				c.store.loadData(r.data); 
			            				var _c = c;
			            			}
			            		);
			            		c.ownerCt.setHeight(275);
			            	},
			            	change: function() { GWDP.ui.getUpdateMap(); }
			            }
			        }]
				},{
					title: 'Contributing Agency',
					xtype: "panel",
					layout: 'form',
					padding: 5,
					labelWidth: 1,//required
					items: [{
						xtype: 'label',
						text: '*Data from any agency is shown if no selection is made'
					},{
			            xtype: 'multiselect',
			            id: 'contributingAgencies',
			            name: 'contributingAgencies',
			            width: 250,
			            height: 200,
			            allowBlank:true,
			            displayField: 'AGENCY_NM',
			            valueField: 'AGENCY_CD',
			            store: GWDP.domain.Agency.getAgencyStore(),
			            tbar:[{
			                text: 'clear',
			                handler: function(){
				                Ext.getCmp('contributingAgencies').reset();
				                GWDP.ui.getUpdateMap();
				            }
			            }],
			            ddReorder: true,
			            listeners: {
			            	added: function(c) {
			            		GWDP.domain.Agency.getAgencyMetadata(
			            			{},
			            			function(r){
			            				c.store.loadData(r.data); 
			            				var _c = c;
			            			}
			            		);
			            		c.ownerCt.setHeight(275);
			            	},
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
					border: false,
				},
				items: [GWDP.ui.pointsCount,GWDP.ui.waterLevelCount,GWDP.ui.waterQualityCount
				]
			}        
    	]
    });
    
    var minimize = function() {
    	header.expand(false);
    	footer.expand(false);
    	filterPanel.expand(false);
    };
    
    var maximize = function() {
    	header.collapse(true);
    	footer.collapse(true);
    	filterPanel.collapse(true);
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

GWDP.ui.constructWLorQWFilters = function(filterVals, WLorQWPrefix) {
	var typeParam = WLorQWPrefix + "_WELL_TYPE";
	var charsParam = WLorQWPrefix + "_WELL_CHARS";
	var flagParam = WLorQWPrefix + "_SN_FLAG";
	
	var typeFilters = []; //this should remain empty if ALL is selected
	var types = filterVals[typeParam].split(',');
	if(types[0] && types[0].toLowerCase() != 'all') { //if selections that don't include all are made, build an array of filters
		for(var i = 0; i < types.length; i++) {
			typeFilters.push(new OpenLayers.Filter.Comparison({
				type: OpenLayers.Filter.Comparison.EQUAL_TO,
				property: typeParam,
				value: types[i]
			}));
		}
	} if(!types || !types[0]) { //when nothing is selected, turn OFF
		typeFilters.push(new OpenLayers.Filter.Comparison({
			type: OpenLayers.Filter.Comparison.EQUAL_TO,
			property: typeParam,
			value: "POINTS_OFF"
		}));
	}
	
	var charsFilters = [];
	var chars = filterVals[charsParam].split(',');
	if(chars[0] && chars[0].toLowerCase() != 'all') {
		for(var i = 0; i < chars.length; i++) {
			charsFilters.push(new OpenLayers.Filter.Comparison({
				type: OpenLayers.Filter.Comparison.EQUAL_TO,
				property: charsParam,
				value: chars[i]
			}));
		}
	} if(!chars || !chars[0]) { //when nothing is selected, turn OFF
		charsFilters.push(new OpenLayers.Filter.Comparison({
			type: OpenLayers.Filter.Comparison.EQUAL_TO,
			property: charsParam,
			value: "POINTS_OFF"
		}));
	}
	
	var flagLevelFilter = new OpenLayers.Filter.Comparison({
		type: OpenLayers.Filter.Comparison.EQUAL_TO,
		property: flagParam,
		value: "1"
	});
	
	if(charsFilters.length == 0 && typeFilters.length==0) { //showing all categories and subetworks by not filtering on them
		return flagLevelFilter;
	} else {
		var andFilter = [flagLevelFilter];
		
		if(typeFilters.length > 1) {
			andFilter.push(new OpenLayers.Filter.Logical({
				type: OpenLayers.Filter.Logical.OR,
				filters: typeFilters
			}));
		} else if(typeFilters.length == 1){
			andFilter.push(typeFilters[0]);
		}
		
		if(charsFilters.length > 1) {
			andFilter.push(new OpenLayers.Filter.Logical({
				type: OpenLayers.Filter.Logical.OR,
				filters: charsFilters
			}));
		} else if(charsFilters.length == 1) {
			andFilter.push(charsFilters[0]);
		}
		
		return new OpenLayers.Filter.Logical({
			type: OpenLayers.Filter.Logical.AND,
			filters: andFilter
		});
	}
};

GWDP.ui.constructWLFilters = function(filterVals) {
	return GWDP.ui.constructWLorQWFilters(filterVals, 'WL');
};

GWDP.ui.constructQWFilters = function(filterVals) {
	return GWDP.ui.constructWLorQWFilters(filterVals, 'QW');
};

GWDP.ui.constructNetworkFilters = function(filterVals) { 
	var wlFlag = filterVals['WL_SN_FLAG'] == 'on';
	var qwFlag = filterVals['QW_SN_FLAG'] == 'on';
	
	var wlFilter;
	if(wlFlag) {
		wlFilter = GWDP.ui.constructWLFilters(filterVals);
	}
	
	var qwFilter;
	if(qwFlag) {
		qwFilter = GWDP.ui.constructQWFilters(filterVals);
	}
	
	if(qwFilter && wlFilter) { //if both filters exist, OR them
		return new OpenLayers.Filter.Logical({
			type: OpenLayers.Filter.Logical.OR,
			filters: [qwFilter, wlFilter]
		});
	} else if (qwFilter){ //if just one of the filters, return it
		return qwFilter;
 	} else if (wlFilter){
		return wlFilter;
 	}  else { //if everything in the network filters is unchecked, we show nothing
		return new OpenLayers.Filter.Comparison({
			type: OpenLayers.Filter.Comparison.EQUAL_TO,
			property: "QW_SN_FLAG",
			value: "POINTS_OFF" //this string must be an actual invalid value to be off
		});
	}
};

GWDP.ui.constructAquiferFilters = function(filterVals) { 
	var aquiferFilter = filterVals['principleAquifer'];
	if(!aquiferFilter) {
		return null;
	}
	
	var aquifers = aquiferFilter.split(',');
	
	if(aquifers.length==1) {
		return new OpenLayers.Filter.Comparison({
			type: OpenLayers.Filter.Comparison.EQUAL_TO,
			property: "NAT_AQUIFER_CD",
			value: aquifers[0]
		});
	}
	
	var olAquiferFilters = [];
	for(var i = 0; i < aquifers.length; i++) {
		olAquiferFilters.push(new OpenLayers.Filter.Comparison({
			type: OpenLayers.Filter.Comparison.EQUAL_TO,
			property: "NAT_AQUIFER_CD",
			value: aquifers[i]
		}));
	}
	
	if(olAquiferFilters.length > 0) {
		return new OpenLayers.Filter.Logical({
			type: OpenLayers.Filter.Logical.OR,
			filters: olAquiferFilters
		});
	} else {
		return null;
	}
};

GWDP.ui.constructAgencyFilters = function(filterVals) { 
	var agencyFilter = filterVals['contributingAgencies'];
	if(!agencyFilter) {
		return null;
	}
	
	var agencys = agencyFilter.split(',');
	
	if(agencys.length==1) {
		return new OpenLayers.Filter.Comparison({
			type: OpenLayers.Filter.Comparison.EQUAL_TO,
			property: "AGENCY_CD",
			value: agencys[0]
		});
	}
	
	var olAgencyFilters = [];
	for(var i = 0; i < agencys.length; i++) {
		olAgencyFilters.push(new OpenLayers.Filter.Comparison({
			type: OpenLayers.Filter.Comparison.EQUAL_TO,
			property: "AGENCY_CD",
			value: agencys[i]
		}));
	}
	
	if(olAgencyFilters.length > 0) {
		return new OpenLayers.Filter.Logical({
			type: OpenLayers.Filter.Logical.OR,
			filters: olAgencyFilters
		});
	} else {
		return null;
	}
};

GWDP.ui.getCurrentFilterCQL = function() {
	var filterVals = GWDP.ui.getFilterFormValues();
	
	var topLevelAndArray = [];
	
	var networkFilter = GWDP.ui.constructNetworkFilters(filterVals);
	if(networkFilter) topLevelAndArray.push(networkFilter);

	var aquiferFilter = GWDP.ui.constructAquiferFilters(filterVals);
	if(aquiferFilter) topLevelAndArray.push(aquiferFilter);
	
	var agencyFilter = GWDP.ui.constructAgencyFilters(filterVals);
	if(agencyFilter) topLevelAndArray.push(agencyFilter);
	
	if(topLevelAndArray.length > 0) {
		return new OpenLayers.Filter.Logical({
			type: OpenLayers.Filter.Logical.AND,
			filters: topLevelAndArray
		});
	} else {
		return null;
	}
};

GWDP.ui.getCurrentFilterCQLAsString = function() {
	var filter = GWDP.ui.getCurrentFilterCQL();
	if(filter) {
//		console.log(filter.toString());
		return filter.toString();
	} else {
		return '';
	}
};

Ext.onReady(GWDP.ui.initApp);
