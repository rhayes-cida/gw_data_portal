var siteIdTpl = new Ext.XTemplate(
	'<tpl for=".">',
		'<div id="id-container">',
			'<table border="0"><tr><td width="20%" valign="top">',
			'<img src="assets/images/logos/{logo}" width="150"/>',
			'</td><td width="80%">',
			'<table id="id-table" width="100%" border="1">',
				'<tr><th>Agency</th><td>{agency}</td></tr>',
				'<tr><th>Site Name</th><td>{siteName}</td></tr>',
				'<tr><th>Site #</th><td>{siteNo}</td></tr>',
				'<tr><th>Lat/Long(WGS84)</th><td>{[parseFloat(values.decLatVa).toFixed(4)]},{[parseFloat(values.decLongVa).toFixed(4)]}</td></tr>',
				'<tr><th>National Aquifer Name</th><td>{nationalAquiferName}</td></tr>',
				'<tr><th>Water Level Network</th><td>{wlWellType}</td></tr>',
				'<tr><th>Water Quality Network</th><td>{qwWellType}</td></tr>',
//				'<tr><th>Well Depth</th><td>{wellDepth} ft.</td></tr>',
			'</table>',
			'</td></tr></table>',
		'</div>',
	'</tpl>'
);
siteIdTpl.compile();

function createXmlDoc(str) {

	var theDocument = false;	//this will be the XML document

	if (window.ActiveXObject) {		//for IE users......

		try {

			//parse the request String to form an XML document.
			theDocument = new ActiveXObject("Microsoft.XMLDOM");
			theDocument.async = false;
			theDocument.loadXML(str);

		} catch (e) {

			//oops. something went wrong in your parsing.		
			alert("Error parsing XML.");

			return false;
		}
	} else if (window.XMLHttpRequest) {		//for everyone else

		try {

			//parse the request String to form an XML document.
			var parser = new DOMParser();        
			theDocument = parser.parseFromString(str, "text/xml");

		} catch (e) {
			//oops. something went wrong in your parsing.
			alert("Error parsing XML.");

			return false;
		}

	} 

	return theDocument;
}


var waterLevelStore = new Ext.data.XmlStore({							
	id: 'water-level-store',
	record: 'TimeValuePair',
	fields: [
	 		{ name: 'time', mapping: 'time', type: 'date', dateFormat: 'c'},
			{ name: 'value', mapping: 'value > Quantity > value'},
//			{ name: 'method', mapping: 'method'},
			{ name: 'unit', mapping: 'Quantity > uom@code'}
	],
	sortInfo: {
		field: 'time',
		direction: 'DESC'
	},
	listeners: {
		load: function(s,r,o) {
			var data = [];
			for (var i = 0; i < r.length; i++) {
				data.push([r[i].get('time'), parseFloat(r[i].get('value')).toFixed(4)]);
			}
			Ext.getCmp('ext-flot').setData([{label: 'Depth to water in feet', data:data}]);
			Ext.getCmp('ext-flot').setupGrid();
			Ext.getCmp('ext-flot').draw();
		}
	}
});

var waterQualityStore = new Ext.data.XmlStore({
	//url: 'iddata?request=water_quality&siteNo=' + this.siteRecord.get('siteNo'),
	proxy: new Ext.data.HttpProxy({
		method: 'GET',
		url: 'iddata'
	}),
	baseParams: {
		request: 'water_quality'
	},
	record: 'Result',
	sortInfo: {
		field: 'ActivityStartDate',
		direction: 'DESC'
	},
	fields: [
	    { name: 'ActivityStartDate', mapping: 'date', xtype: 'datecolumn', format: 'Y-M-d'},
	    { name: 'ActivityStartTime', mapping: 'time', xtype: 'datecolumn', format: 'H:i:s'},
	    //{ name: 'ActivityMediaSubdivisionName', mapping: 'ActivityDescription > ActivityMediaSubdivisionName'},
	    { name: 'TimeZoneCode', mapping: 'zone'},
	    { name: 'CharacteristicName', mapping: 'ResultDescription > CharacteristicName'},
	    { name: 'ResultSampleFractionText', mapping: 'ResultDescription > ResultSampleFractionText'},
	    { name: 'ResultMeasureValue', mapping: 'ResultDescription > ResultMeasure > ResultMeasureValue'},
	    { name: 'MeasureUnitCode', mapping: 'ResultDescription > ResultMeasure > MeasureUnitCode'},
	    { name: 'ResultDetectionConditionText', mapping: 'ResultDescription > ResultDetectionConditionText'},
	    { name: 'ResultValueTypeName', mapping: 'ResultDescription > ResultValueTypeName'},
	    { name: 'USGSPCode', mapping: 'ResultDescription > USGSPCode'}
	]
});
//ActivityStartDate, ActivityStartTime, TimeZoneCode, CharacteristicName, ActivityMediaSubdivisionName, 
//ResultSampleFractionTest, ResultMeasureValue, ResultDetectionConditionText, MeasureUnitCode, 
//ResultValueTypeName, USGSPCode


var SiteIdentifyWindow = Ext.extend(Ext.Window, {
	id: 'identify-site-window',
	height: 500,
	width: 800,
	modal: true,
	layout: 'fit',
	initComponent: function() {
	
		var tabPanel = new Ext.TabPanel({
			id: 'ext-id-tabpanel',
			xtype: 'tabpanel',
			autoScroll: true,
			activeTab: 0,
			border: false,
			items: [{
				title: 'Summary',
				id: 'site-id-panel',
				record: this.siteRecord,
				border: false,
				autoScroll: true,
				layout: 'anchor',
				bodyStyle: 'padding: 5px',
				listeners: {
					afterrender: function(p) {
						siteIdTpl.overwrite(p.body, p.record.data);
					}
				}
			}]
		});
		
		/*if (this.siteRecord.get('agency') == 'USGS NJ / NJGS' ||
				this.siteRecord.get('agency') == 'IL EPA' ||
				this.siteRecord.get('agency') == 'IN DNR') {*/
		if (true) {
			
			var tbar = null;
			
			if (this.siteRecord.get('agency') == 'USGS PA') {
				
				tbar = new Ext.Toolbar({items:[{xtype: 'tbtext', text: 'Select Mediator:'}]});
				
				var c = new Ext.form.ComboBox({
					store: new Ext.data.ArrayStore({
						fields: ['name'],
						data: [['usgs'],['PA']]
					}),
			        displayField:'name',
			        mode: 'local',
			        forceSelection: true,
			        triggerAction: 'all',
			        selectOnFocus:true,
			        value: 'usgs',
			        getListParent: function() {
			            return this.el.up('.x-menu');
			        },
			        listeners: {
			        	select: function(c,r,i) {
			        		loadWellLogTab(this.siteRecord, r.get('name'))
			        	},
			        	scope: this
			        }
				});
				
				tbar.addField(c);
				tbar.doLayout();
			} 
			
			
			//add well log
			tabPanel.add(new Ext.Panel({
				id: 'well-log-tab',
				title: 'Well Log',
				bodyStyle: 'padding:5px',
				isLoaded: false,
				layout: 'fit',
				autoScroll: true,
				tbar: tbar,
				listeners: {
					activate: function(p) {
						if (!p.isLoaded) {
							p.isLoaded = true;
							loadWellLogTab(this.siteRecord);
						}
					},
					scope: this
				}
			}));
			
			//add water level
			if (this.siteRecord.get('wlSnFlag').toUpperCase() == 'YES') {
				
				var waterLevelTbar = null;
				
				if (this.siteRecord.get('agency') == 'ISWS') {
					
					waterLevelTbar = new Ext.Toolbar({
						items:[{
					    	text: 'Export as XML',
					    	handler: function() {
								document.getElementById('wl-siteid').value = 'USGS.' + this.siteRecord.get('siteNo');
								document.getElementById('wl-xml-export').submit();
							}, 
							scope: this
					    },{
							xtype: 'tbtext', 
							text: 'Select Mediator:'
						}]
					});
								
					var c = new Ext.form.ComboBox({
						store: new Ext.data.ArrayStore({
							fields: ['name'],
							data: [['usgs'],['ISWS']]
						}),
				        displayField:'name',
				        mode: 'local',
				        forceSelection: true,
				        triggerAction: 'all',
				        selectOnFocus:true,
				        value: 'usgs',
				        getListParent: function() {
				            return this.el.up('.x-menu');
				        },
				        listeners: {
				        	select: function(c,r,i) {
				        		loadWaterLevelTab(this.siteRecord, r.get('name'))
				        	},
				        	scope: this
				        }
					});
					
					waterLevelTbar.addField(c);
					waterLevelTbar.doLayout();
					
				} 
				
				waterLevelStore.removeAll();
				tabPanel.add(new Ext.Panel({
					id: 'ext-water-level-tab',
					title: 'Water Levels',
					isLoaded: false,
					layout: 'border',
					tbar: waterLevelTbar,
					listeners: {
						activate: function(p) {
							if (!p.isLoaded) {
								p.isLoaded = true;
				        		loadWaterLevelTab(this.siteRecord)
							}
						},
						scope: this
					},
					items: [{
						region: 'center',
						autoScroll: true,
						padding: 5,
						items: [{
							colors: ['darkblue'],
							title: 'Graph',
							xtype: 'flot',
							height: 400,
							//autoWidth: true,
							width: 600,
							id: 'ext-flot',
							hoverable: true,
							lines: {
								show: true,
								lineWidth: 1
							},
							points: {
								show: true,
								radius: 2,
								fillColor: 'blue'
							},
							legend: {
							    show: true,
							    labelBoxBorderColor: 'black',
							    position: "se"
							},
							xaxis: {
								mode: 'time',
								timeformat: "%m/%d/%y",
								minTickSize: [1, "year"],
					            axisLabel: 'Month/Year',
					            axisLabelUseCanvas: true
							},
							yaxis: {
								invert: true,
								axisLabel: 'Depth to water level, feet below land surface',
						        axisLabelUseCanvas: true
							},
							series: [ {data: [[]]} ],
					        grid: {
								backgroundColor: 'white'
							}
						},{
							border: false,
							height: 25,
							html:'<div>Date created: ' + document.lastModified + '</div><br/>'
						},{
							xtype: 'grid',
							loadMask: true,
							autoHeight: true,
							//autoScroll: true,
							//height: 500,
							viewConfig: {forceFit: true},
						    sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
						    colModel: new Ext.grid.ColumnModel([
				                { header: "Date", width: 150, dataIndex: 'time', xtype:'datecolumn', format: 'm-d-Y' },
				                { header: "Time", width: 150, dataIndex: 'time', xtype:'datecolumn', format: 'H:iP' },
				                { header: "Value", width: 100, dataIndex: 'value' },
				                { header: "Unit", width: 50, dataIndex: 'unit' }//,
//				                { header: "Method", width: 300, dataIndex: 'method' }
				            ]),
							store: waterLevelStore/*,
						    view: new Ext.ux.grid.BufferView({
							    // custom row height
							    rowHeight: 34,
							    // render rows as they come into viewable area.
							    scrollDelay: false
						    })
						    */
						}]
					}]
				}));
			}
			
			
			
			
			//add water quality
			if (this.siteRecord.get('qwSnFlag').toUpperCase() == 'YES') {
				
				tabPanel.add(new Ext.Panel({
					id: 'water-quality-tab',
					title: 'Water Quality',
					//padding: 5,
					//autoLoad: 'iddata?request=water_quality&siteNo=' + this.siteRecord.get('siteNo'),
					autoScroll: true,
					isLoaded: false,
					listeners: {
						activate: function(p) {
							if (!p.isLoaded) {
								p.doLayout();
								p.isLoaded = true;
								waterQualityStore.removeAll();
								waterQualityStore.load({
									params:{siteNo:this.siteRecord.get('siteNo')}
								});
							}
						},
						scope: this
					},
					tbar: [{
				    	text: 'Export as CSV',
				    	handler: function() {
							document.getElementById('qw-siteid').value = 'USGS-' + this.siteRecord.get('siteNo');
							document.getElementById('qw-csv-export').submit();
						}, 
						scope: this
				    }],
				    //layout: 'border',
					items: [{
						xtype: 'grid',
						border: false,
						loadMask: true,
						autoHeight: true,
						width: 1450,
						//region: 'center',
						//layout: 'fit',
						viewConfig: {forceFit: true},
					    sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
					    colModel: new Ext.grid.ColumnModel([
			                { header: "Characteristic Name", width: 200, dataIndex: 'CharacteristicName'},
			                { header: "Detection Condition", width: 200, sortable: true, dataIndex: 'ResultDetectionConditionText'},
			                { header: "Measure Value", width: 150, sortable: true, dataIndex: 'ResultMeasureValue',
			                	renderer: function(value, metaData, record, rowIndex, colIndex, store) {
			                		if (value == '') {
			                			return 'Not Detected';
			                		}
			                		return value;
			                	}
			                },
			                { header: "Units", width: 150, sortable: true, dataIndex: 'MeasureUnitCode'},
			                { header: "Value Type", width: 150, sortable: true, dataIndex: 'ResultValueTypeName'},
			                { header: "Sample Fraction", width: 150, sortable: true, dataIndex: 'ResultSampleFractionText'},
			                { header: "USGS P-Code", width: 100, sortable: true, dataIndex: 'USGSPCode'},	                
			                //{ header: "Activity Media Subdivision Name", width: 150, sortable: true, dataIndex: 'ActivityMediaSubdivisionName'},
			                { header: "Activity Start Date", width: 100, sortable: true, dataIndex: 'ActivityStartDate'},	                
			                { header: "Activity Start Time", width: 100, sortable: true, dataIndex: 'ActivityStartTime'},	                
			                { header: "Time Zone Code", width: 150, sortable: true, dataIndex: 'TimeZoneCode'}
			            ]),
						store: waterQualityStore
					}]
				}));
			}
		}
		

	
		Ext.apply(this, {
			title: this.siteRecord.get('siteName'),
			items: [tabPanel],
			buttons: [{
				text: 'Close',
				handler: function() {
					Ext.getCmp('identify-site-window').close();
				}
			}]
		});
		SiteIdentifyWindow.superclass.initComponent.call(this);
	}
});

function loadWaterLevelTab(record, mediator) {
	Ext.getCmp('ext-water-level-tab').body.mask('Loading...','x-mask-loading');
	Ext.Ajax.request({
		method: 'GET',
		/*
		url: '../cocoon/gin/sos/gw_' + (mediator||'usgs'),
		params: {
			request: 'GetObservation',
			featureId: 'USGS-' + record.get('siteNo')
		},
		*/
		
		url: 'iddata?request=water_level',
		params: {
			siteNo: record.get('siteNo'),
			mediator: mediator
		},
		
		success: function(r, o) {
			var rs = r.responseText.replace(/<[a-zA-Z0-9]+:/g,'<')
			rs = rs.replace(/<\/[a-zA-Z0-9]+:/g,'</');
			//rs = rs.replace('wml2:value','wml2_value');
			waterLevelStore.loadData(createXmlDoc(rs));
			Ext.getCmp('ext-water-level-tab').body.unmask();
		}
	});
}


function loadWellLogTab(record, mediator) {
	Ext.getCmp('well-log-tab').body.mask('Loading...','x-mask-loading');
	Ext.Ajax.request({
		method: 'GET',
		/*
		url: '../cocoon/gin/wfs/gw_' + (mediator||'usgs'),
		params: {
			request: 'GetFeature',
			typeName: 'gwml:WaterWell',
			INFO_FORMAT: 'text/xml',
			FID: 'USGS.' + record.get('siteNo')
		},
		*/
		
		url: 'iddata?request=well_log',
		params: {
			siteNo: record.get('siteNo'),
			mediator: mediator
			//siteNo: 425856089320601
		},
		
		success: function(r, o) {
			Ext.getCmp('well-log-tab').body.unmask();
			var rs = r.responseText.replace(/<[a-zA-Z0-9]+:/g,'<')
			rs = rs.replace(/<\/[a-zA-Z0-9]+:/g,'</');
			var x = createXmlDoc(rs);
			
			if (x.getElementsByTagName('pos').length == 0) {
				Ext.getCmp('well-log-tab').body.innerHTML = '<h1>No Data Found</h1>';
				return;
			}
			
			var so = {
				position: x.getElementsByTagName('pos')[0].firstChild.nodeValue,
				elevation: x.getElementsByTagName('referenceElevation')[0].firstChild.nodeValue,
				wellDepth: x.getElementsByTagName('principalValue')[0].firstChild.nodeValue,
				onlineResource: x.getElementsByTagName('onlineResource')[0].getAttribute('xlink:href'),
				onlineResourceTitle: x.getElementsByTagName('onlineResource')[0].getAttribute('xlink:title')
			};
			
			var logEls = x.getElementsByTagName('logElement');
			so.logObjs = [];
			for (var i = 0; i < logEls.length; i++) {
				var f = logEls[i].getElementsByTagName('coordinates')[0].firstChild.nodeValue.split(' ')[0];
				var t = logEls[i].getElementsByTagName('coordinates')[0].firstChild.nodeValue.split(' ')[1];
				
				so.logObjs.push({
					intervalFrom: f,
					intervalTo: t,
					height: t - f,
					description: (logEls[i].getElementsByTagName('description'))?logEls[i].getElementsByTagName('description')[0].firstChild.nodeValue : 'No Description'
				});
			}
			
			var graphicHTML = '';
			if (so.logObjs && so.logObjs.length > 0) {
				
				//create graphic
				var graphicHeight = 300;
				var intervalColor = ['#ff4','#dd4','#bb4','#994','#774','#554','#334','#114'];
				var fontColor = ['#000','#000','#000','#000','#fff','#fff','#fff','#fff'];
				graphicHTML = '<table class="well-log-graphic">';
				
				var totalDepth = (so.logObjs[so.logObjs.length-1].intervalTo - so.logObjs[0].intervalFrom);
				for (var i = 0; i < so.logObjs.length; i++) {
					var relHeight = graphicHeight * ((so.logObjs[i].height) / totalDepth);
					if (relHeight < 20) relHeight = 20;
	
					if (i == 0) {
						graphicHTML += '<tr><td><span style="font-size: 80%;">' + (so.logObjs[i].intervalFrom * 3.2808399).toFixed(2) + ' ft</span></td></tr>'; 
					}
					
					graphicHTML += '<tr><td style="height:' + relHeight + 'px; border: solid black 1px; width: 50px;">' + 
							'<div style="height: 100%; position: relative; ' + 
								'background-color: ' + intervalColor[(i%intervalColor.length)] + '; ' + 
								'color: ' + fontColor[(i%fontColor.length)] + 
							';">';
	
					graphicHTML += '<span style="position: absolute; bottom: 0px; font-size: 80%;">' + (so.logObjs[i].intervalTo * 3.2808399).toFixed(2) + ' ft</span>' + 
							'</div>' + 
						'</td>' + 
						'<td style="height:' + relHeight + 'px; padding-left: 5px;" valign="middle">' + 
							so.logObjs[i].description + 
						'</td></tr>';
				}
				graphicHTML += '</table>';
			}
			
			var t = new Ext.XTemplate(
				'<tpl for=".">',
					'<table>',
						'<tr><td style="height:35px">Longitude: {[parseFloat(values.position.split(" ")[0]).toFixed(4)]}</td><td rowspan="6">' + graphicHTML + '</td></tr>',
						'<tr><td style="height:35px">Latitude: {[parseFloat(values.position.split(" ")[1]).toFixed(4)]}</td></tr>',
						'<tr><td style="height:35px">Elevation: {[(values.elevation * 3.2808399).toFixed(2)]} ft.</td></tr>',
						'<tr><td style="height:35px">Well Depth: {[(values.wellDepth * 3.2808399).toFixed(2)]} ft.</td></tr>',
						'<tr><td style="height:35px">Resource: <a href="{onlineResource}" target="_blank">{onlineResourceTitle}</a></td></tr>',
						'<tr><td>&nbsp;</td></tr>',
					'</table>',
					'<br/>',
					'<table class="summary-table" border="1">',
						'<tr><th>Depth From (ft)</th><th>Depth To (ft)</th><th>Lithography</th></tr>',
					'<tpl for="logObjs">',
						'<tr><td>{[(values.intervalFrom * 3.2808399).toFixed(2)]}</td><td>{[(values.intervalTo * 3.2808399).toFixed(2)]}</td><td>{description}</td></tr>',
					'</tpl>',
					'</table>',
				'</tpl>'
			);
			
			t.overwrite(Ext.getCmp('well-log-tab').body, so);
		}
	});
}