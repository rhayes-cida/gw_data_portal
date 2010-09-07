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
	record: 'element',
	fields: [
	 		{ name: 'time', mapping: 'TimeValuePair > time'},
			{ name: 'value', mapping: 'TimeValuePair > value > Quantity > value'},
			{ name: 'unit', mapping: 'TimeValuePair > value > Quantity > uom@code'}
	]
});


var SiteIdentifyWindow = Ext.extend(Ext.Window, {
	id: 'identify-site-window',
	height: 300,
	width: 700,
	modal: true,
	layout: 'fit',
	initComponent: function() {
	
		var tabPanel = new Ext.TabPanel({
			id: 'ext-id-tabpanel',
			xtype: 'tabpanel',
			deferredRender: true,
			autoscroll: true,
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
				autoScroll: true,
				listeners: {
					afterrender: function() {
					Ext.Ajax.request({
						url: 'iddata?request=well_log&siteNo=435629089353901',
						/*baseParams: {
							siteNo: this.siteRecord.get('siteNo')
						},*/
						success: function(r, o) {
							var rs = r.responseText.replace(/<[a-zA-Z0-9]+:/g,'<')
							rs = rs.replace(/<\/[a-zA-Z0-9]+:/g,'</');
							var x = createXmlDoc(rs);
							
							var so = {
								position: x.getElementsByTagName('pos')[0].firstChild.nodeValue,
								elevation: x.getElementsByTagName('referenceElevation')[0].firstChild.nodeValue,
								wellDepth: x.getElementsByTagName('principalValue')[0].firstChild.nodeValue,
								onlineResource: x.getElementsByTagName('onlineResource')[0].getAttribute('xlink:href'),
								onlineResourceTitle: x.getElementsByTagName('onlineResource')[0].getAttribute('xlink:title')
							}
							
							var logEls = x.getElementsByTagName('logElement');
							so.logObjs = [];
							for (var i = 0; i < logEls.length; i++) {
								so.logObjs.push({
									intervalFrom: logEls[i].getElementsByTagName('coordinates')[0].firstChild.nodeValue.split(' ')[0],
									intervalTo: logEls[i].getElementsByTagName('coordinates')[0].firstChild.nodeValue.split(' ')[1],
									description: logEls[i].getElementsByTagName('description')[0].firstChild.nodeValue
								})
							}
							
							var t = new Ext.XTemplate(
								'<tpl for=".">',
									'<table>',
										'<tr><td>Longitude: {[values.position.split(" ")[0]]}</td></tr>',
										'<tr><td>Latitude: {[values.position.split(" ")[1]]}</td></tr>',
										'<tr><td>Elevation: {elevation} ft.</td></tr>',
										'<tr><td>Well Depth: {wellDepth} ft.</td></tr>',
										'<tr><td>Resource: <a href="{onlineResource}" target="_blank">{onlineResourceTitle}</a></td></tr>',
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
				},
				scope: this
			}
			}));
			
			//add water level
			if (this.siteRecord.get('wlSnFlag').toUpperCase() == 'YES') {
				tabPanel.add(new Ext.Panel({
					title: 'Water Levels',
					//autoLoad: 'iddata?request=water_level&siteNo=' + this.siteRecord.get('siteNo')
					//http://infotrek.er.usgs.gov/ogc-ie/sosbbox?north=43&south=42.9&east=-89.57&west=-89.65
					layout: 'border',
					listeners: {
						afterrender: function() {
							Ext.Ajax.request({
								url: 'iddata?request=water_level',
								baseParams: {
									siteNo: this.siteRecord.get('siteNo')
								},
								success: function(r, o) {
									var rs = r.responseText.replace(/<[a-zA-Z0-9]+:/g,'<')
									rs = rs.replace(/<\/[a-zA-Z0-9]+:/g,'</');
									rs = rs.replace('wml2:value','wml2_value');
									waterLevelStore.loadData(createXmlDoc(rs));
								}
							});
						},
						scope: this
					},
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
			                { header: "Time", width: 200, dataIndex: 'time' },
			                { header: "Value", width: 200, dataIndex: 'value' },
			                { header: "Unit", width: 200, dataIndex: 'unit' }
			            ]),
						store: waterLevelStore
					}]
				}));
			}
			
			
			
			
			//add water quality
			if (this.siteRecord.get('qwSnFlag').toUpperCase() == 'YES') {
				tabPanel.add(new Ext.Panel({
					id: 'water-quality-tab',
					title: 'Water Quality',
					layout: 'border',

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
			                { header: "ResultMeasureValue", width: 150, sortable: true, dataIndex: 'ResultMeasureValue'},
			                { header: "MeasureUnitCode", width: 150, sortable: true, dataIndex: 'MeasureUnitCode'},
			                { header: "USGSPCode", width: 100, sortable: true, dataIndex: 'USGSPCode'}	                
			            ]),
						store: new Ext.data.XmlStore({
							autoLoad: true,
							id: 'wq-store',
							url: 'iddata?request=water_quality&siteNo=' + this.siteRecord.get('siteNo'),
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
								    { name: 'USGSPCode', mapping: 'ResultDescription > USGSPCode'}
							]
						})
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