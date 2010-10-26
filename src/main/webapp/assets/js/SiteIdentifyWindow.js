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
				'<tr><th>Lat/Long(WGS84)</th><td>{decLatVa},{decLongVa}</td></tr>',
				'<tr><th>National Aquifer Name</th><td>{nationalAquiferName}</td></tr>',
				'<tr><th>Water Level Network</th><td>{wlWellType}</td></tr>',
				'<tr><th>Water Quality Network</th><td>{qwWellType}</td></tr>',
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
			{ name: 'method', mapping: 'method'},
			{ name: 'unit', mapping: 'Quantity > uom'}
	],
	sortInfo: {
		field: 'time',
		direction: 'ASC'
	},
	listeners: {
		load: function(s,r,o) {
			var data = [];
			for (var i = 0; i < r.length; i++) {
				data.push([r[i].get('time'), r[i].get('value')]);
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
		field: 'CharacteristicName',
		direction: 'ASC'
	},
	fields: [
		    { name: 'CharacteristicName', mapping: 'ResultDescription > CharacteristicName'},
		    { name: 'ResultSampleFractionText', mapping: 'ResultDescription > ResultSampleFractionText'},
		    { name: 'ResultMeasureValue', mapping: 'ResultDescription > ResultMeasure > ResultMeasureValue'},
		    { name: 'MeasureUnitCode', mapping: 'ResultDescription > ResultMeasure > MeasureUnitCode'},
		    { name: 'USGSPCode', mapping: 'ResultDescription > USGSPCode'},
		    { name: 'AnalysisStartDate', mapping: 'LabSamplePreparation > PreparationStartDate', xtype: 'datecolumn', format: 'Y-M-d'}
	]
});


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
		
		if (this.siteRecord.get('agency') == 'USGS NJ / NJGS') {
			//add well log
			tabPanel.add(new Ext.Panel({
				id: 'well-log-tab',
				title: 'Well Log',
				bodyStyle: 'padding:5px',
				renderWL: 0,
				layout: 'fit',
				autoScroll: true,
				listeners: {
					afterlayout: function(p) {
						if (p.renderWL++ == 2) {
							p.body.mask('Loading...','x-mask-loading');
							Ext.Ajax.request({
								method: 'GET',
								url: 'iddata?request=well_log',
								params: {
									siteNo: this.siteRecord.get('siteNo')
									//siteNo: 425856089320601
								},
								success: function(r, o) {
									p.body.unmask();
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
		
											if (i == 0) {
												graphicHTML += '<tr><td><span style="font-size: 80%;">' + so.logObjs[i].intervalFrom + '</span></td></tr>'; 
											}
											
											graphicHTML += '<tr><td style="height:' + relHeight + 'px; border: solid black 1px; width: 50px;">' + 
													'<div style="height: 100%; position: relative; ' + 
														'background-color: ' + intervalColor[(i%intervalColor.length)] + '; ' + 
														'color: ' + fontColor[(i%fontColor.length)] + 
													';">';
		
											graphicHTML += '<span style="position: absolute; bottom: 0px; font-size: 80%;">' + so.logObjs[i].intervalTo + '</span>' + 
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
												'<tr><td style="height:35px">Longitude: {[values.position.split(" ")[0]]}</td><td rowspan="6">' + graphicHTML + '</td></tr>',
												'<tr><td style="height:35px">Latitude: {[values.position.split(" ")[1]]}</td></tr>',
												'<tr><td style="height:35px">Elevation: {elevation} ft.</td></tr>',
												'<tr><td style="height:35px">Well Depth: {wellDepth} ft.</td></tr>',
												'<tr><td style="height:35px">Resource: <a href="{onlineResource}" target="_blank">{onlineResourceTitle}</a></td></tr>',
												'<tr><td>&nbsp;</td></tr>',
											'</table>',
											'<br/>',
											'<table class="summary-table" border="1">',
												'<tr><th>Depth From</th><th>Depth To</th><th>Lithography</th></tr>',
											'<tpl for="logObjs">',
												'<tr><td>{intervalFrom}</td><td>{intervalTo}</td><td>{description}</td></tr>',
											'</tpl>',
											'</table>',
										'</tpl>'
									);
									
									t.overwrite(Ext.getCmp('well-log-tab').body, so);
								}
							});
						}
					},
					scope: this
				}
			}));
			
			//add water level
			if (this.siteRecord.get('wlSnFlag').toUpperCase() == 'YES') {
				waterLevelStore.removeAll();
				tabPanel.add(new Ext.Panel({
					title: 'Water Levels',
					renderWL: 0,
					//autoLoad: 'iddata?request=water_level&siteNo=' + this.siteRecord.get('siteNo')
					//http://infotrek.er.usgs.gov/ogc-ie/sosbbox?north=43&south=42.9&east=-89.57&west=-89.65
					layout: 'border',
					tbar: [{
				    	text: 'Export as XML',
				    	handler: function() {
							document.getElementById('wl-siteid').value = 'USGS.' + this.siteRecord.get('siteNo');
							document.getElementById('wl-xml-export').submit();
						}, 
						scope: this
				    }],
					listeners: {
						afterlayout: function(p) {
							if (p.renderWL++ == 2) {
								p.body.mask('Loading...','x-mask-loading');
								Ext.Ajax.request({
									method: 'GET',
									url: 'iddata?request=water_level',
									params: {
										siteNo: this.siteRecord.get('siteNo')
									},
									success: function(r, o) {
										var rs = r.responseText.replace(/<[a-zA-Z0-9]+:/g,'<')
										rs = rs.replace(/<\/[a-zA-Z0-9]+:/g,'</');
										rs = rs.replace('wml2:value','wml2_value');
										waterLevelStore.loadData(createXmlDoc(rs));
										p.body.unmask();
									}
								});
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
								lineWidth: 1,
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
							viewConfig: {forceFit: true},
						    sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
						    colModel: new Ext.grid.ColumnModel([
				                { header: "Date", width: 150, dataIndex: 'time', xtype:'datecolumn', format: 'm-d-Y' },
				                { header: "Time", width: 150, dataIndex: 'time', xtype:'datecolumn', format: 'H:iP' },
				                { header: "Value", width: 100, dataIndex: 'value' },
				                { header: "Unit", width: 50, dataIndex: 'unit' },
				                { header: "Method", width: 300, dataIndex: 'method' }
				            ]),
							store: waterLevelStore	
						}]
					}]
				}));
			}
			
			
			
			
			//add water quality
			if (this.siteRecord.get('qwSnFlag').toUpperCase() == 'YES') {
				/*
				waterQualityStore.removeAll();
				waterQualityStore.load({
					params:{siteNo:this.siteRecord.get('siteNo')}
				});
				*/
				tabPanel.add(new Ext.Panel({
					id: 'water-quality-tab',
					title: 'Water Quality',
					padding: 5,
					bodyCfg: {
				        cls: 'x-panel-body qw-table'
				    },
					autoLoad: 'iddata?request=water_quality&siteNo=' + this.siteRecord.get('siteNo'),
					autoScroll: true,
					tbar: [{
				    	text: 'Export as CSV',
				    	handler: function() {
							document.getElementById('qw-siteid').value = 'USGS-' + this.siteRecord.get('siteNo');
							document.getElementById('qw-csv-export').submit();
						}, 
						scope: this
				    }]
				
/*
					items: [{
						xtype: 'grid',
						border: false,
						loadMask: true,
						autoScroll: true,
						region: 'center',
						layout: 'fit',
						viewConfig: {forceFit: true},
					    sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
					    colModel: new Ext.grid.ColumnModel([
			                { header: "Characteristic", width: 200, dataIndex: 'CharacteristicName'},
			                { header: "ResultSampleFractionText", width: 200, sortable: true, dataIndex: 'ResultSampleFractionText'},
			                { header: "ResultMeasureValue", width: 150, sortable: true, dataIndex: 'ResultMeasureValue', 
			                	renderer: function(value, metaData, record, rowIndex, colIndex, store) {
			                		if (value == '') {
			                			return 'Not Detected';
			                		}
			                		return value;
			                	}
			                },
			                { header: "MeasureUnitCode", width: 150, sortable: true, dataIndex: 'MeasureUnitCode'},
			                { header: "USGSPCode", width: 100, sortable: true, dataIndex: 'USGSPCode'},	                
			                { header: "AnalysisStartDate", width: 100, sortable: true, dataIndex: 'AnalysisStartDate'}	                
			            ]),
						store: waterQualityStore
					}]*/
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