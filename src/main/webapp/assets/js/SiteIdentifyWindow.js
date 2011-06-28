// Define and compile templates
var siteIdTpl = new Ext.XTemplate(
	'<tpl for=".">',
		'<div id="id-container">',
			'<table border="0"><tr><td width="20%" valign="top">',
			'<img src="assets/images/logos/{logo}" width="150"/>',
			'</td><td width="80%">',
			'<table id="id-table" width="100%" border="1">',
				'<tr><th>Agency</th><td>{agency}</td></tr>',
				'<tr><th>Site Name</th><td>{[SITE.createName(values.siteName, values.agency, values.siteNo)]}</td></tr>',
				'<tr><th>Site #</th><td>{siteNo}</td></tr>',
				'<tr><th>Lat/Long(WGS84)</th><td>{[parseFloat(values.decLatVa).toFixed(4)]},{[parseFloat(values.decLongVa).toFixed(4)]}</td></tr>',
				'<tr><th>Local Aquifer Name</th><td>{localAquiferName}</td></tr>',
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

var wellLogTemplate = new Ext.XTemplate(
		'<tpl for=".">',
			'<table>',
				'<tr><td style="height:35px">Longitude: {[parseFloat(values.position.split(" ")[0]).toFixed(4)]}</td><td rowspan="6">{values.graphicHTML}</td></tr>',
				'<tr><td style="height:35px">Latitude: {[parseFloat(values.position.split(" ")[1]).toFixed(4)]}</td></tr>',
				'<tr><td style="height:35px">Elevation: {[(values.elevation * 1.0).toFixed(2)]} ft.</td></tr>',
				'<tr><td style="height:35px">Well Depth: {[(values.wellDepth * 1.0).toFixed(2)]} ft.</td></tr>',
//					'<tr><td style="height:35px">Elevation: {[(values.elevation * 3.2808399).toFixed(2)]} ft.</td></tr>',
//					'<tr><td style="height:35px">Well Depth: {[(values.wellDepth * 3.2808399).toFixed(2)]} ft.</td></tr>',
				'<tr><td style="height:35px">Resource: <a href="{onlineResource}" target="_blank">{onlineResourceTitle}</a></td></tr>',
				'<tr><td>&nbsp;</td></tr>',
			'</table>',
			'<br/>',
			'<table class="summary-table" border="1">',
//					'<caption><strong>Lithology</strong></caption>',
				'<thead><tr><th>Depth From (ft)</th><th>Depth To (ft)</th><th>Lithology</th><th>Description</th></tr></thead>',
				'<tbody>',
					'<tpl for="logObjs">',
						'<tr><td>{[(values.intervalFrom * 1.0).toFixed(2)]}</td><td>{[(values.intervalTo * 1.0).toFixed(2)]}</td><td>{contrConcept}</td><td>{description}</td></tr>',
//							'<tr><td>{[(values.intervalFrom * 3.2808399).toFixed(2)]}</td><td>{[(values.intervalTo * 3.2808399).toFixed(2)]}</td><td>{description}</td></tr>',
					'</tpl>',
				'</tbody>',
			'</table>',
			'<br/>',
			'<table class="summary-table" border="1">',
				'<tr><th>Depth From (ft)</th><th>Depth To (ft)</th><th>Screen/Casing Material</th></tr>',
			'<tpl for="constrObjs">',
			'<tr><td>{[(values.intervalFrom * 1.0).toFixed(2)]}</td><td>{[(values.intervalTo * 1.0).toFixed(2)]}</td><td>{description}</td></tr>',
//				'<tr><td>{[(values.intervalFrom * 3.2808399).toFixed(2)]}</td><td>{[(values.intervalTo * 3.2808399).toFixed(2)]}</td><td>{description}</td></tr>',
			'</tpl>',
			'</table>',					
		'</tpl>'
	);
wellLogTemplate.compile();

var SITE = {
	createName: function(siteName, agency, siteNo){ /*slightly worried that this won't get called in template */
		if (siteName && siteName != 'null') return siteName;
		return agency + '-' + siteNo;
	},
	hasWaterLevelData: function(siteRecord) {return siteRecord.get('wlSnFlag').toUpperCase() == 'YES';},
	hasWaterQualityData: function(siteRecord) {return siteRecord.get('qwSnFlag').toUpperCase() == 'YES';},
	downloadData: function(siteRecord) {

		var exportForm = document.getElementById('exportForm');
		
		//pop up a new window that displays progress of download
		var downloadWindow = new Ext.Window({
			height: 200,
			width: 300,
			resizable: false,
			title: 'Downloading Site Data...',
			modal: true,
			layout: 'border',
			closable: false,
			items: [{
				border: false,
				region: 'center',
				html: ''
			}],
			buttonAlign: 'center',
			buttons: [{
				text: 'Cancel',
				handler: function() {
					Ext.Msg.show({
						title:'Warning',
						msg: 'Cancel the download?',
						buttons: Ext.Msg.YESNO,
						fn: function(bid) {
							if (bid == 'yes') {
								downloadWindow.close();
							}
						},
						icon: Ext.MessageBox.QUESTION
					});
				},
				scope: this
			}]
		});
		
		downloadWindow.show();
		downloadWindow.body.mask('Please wait...','x-mask-loading');
		
		
		//set src of downloadIframe to begin download...
		var sn = siteRecord.get('siteNo');
		var ac = MEDIATOR.cleanAgencyCode(siteRecord.get('agency'));
		var qwf = siteRecord.get('qwSnFlag');
		var wlf = siteRecord.get('wlSnFlag');
		var token = (new Date()).getTime();
		
		exportForm.siteNo.value = sn;
		exportForm.agency_cd.value = ac;
		exportForm.qwSnFlag.value = qwf;
		exportForm.wlSnFlag.value = wlf;
		exportForm.token.value = token;
		
		
		var exportStatus = setInterval(function() {
			var cookieValue = Ext.util.Cookies.get('exportToken');
			if (cookieValue == token) {
				Ext.util.Cookies.clear('exportToken');
				downloadWindow.close();
				clearInterval(exportStatus);
			}	  
		}, 1000);
		
		exportForm.submit();
	}
}


function removeNameSpaces(xmlStr){
	var result = xmlStr.replace(/<[a-zA-Z0-9]+:/g,'<')
	result = result.replace(/<\/[a-zA-Z0-9]+:/g,'</');
	return result;
}


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
		
		// Add well log
		if (true) {		
			tabPanel.add(new Ext.Panel({
				id: 'well-log-tab',
				title: 'Well Log',
				bodyStyle: 'padding:5px',
				isLoaded: false,
				layout: 'fit',
				autoScroll: true,
				listeners: {
					activate: function(p) {
						if (!p.isLoaded) {
							p.isLoaded = true;
							WELL_LOG_TAB.load(this.siteRecord);
						}
					},
					scope: this
				}
			}));
		}
		
		// Conditionally add water level tab
		if (SITE.hasWaterLevelData(this.siteRecord)) {

			WATER_LEVEL_TAB.store.removeAll();
			tabPanel.add(new Ext.Panel({
				id: 'water-level-tab',
				title: 'Water Levels',
				isLoaded: false,
				layout: 'border',
				listeners: {
					activate: function(p) {
						if (!p.isLoaded) {
							p.isLoaded = true;
							WATER_LEVEL_TAB.load(this.siteRecord)
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
								 { header: "Date", width: 60, dataIndex: 'time', xtype:'datecolumn', format: 'm-d-Y' },
								 { header: "Time", width: 60, dataIndex: 'time', xtype:'datecolumn', format: 'H:iP' },
								 { header: "Value", width: 60, dataIndex: 'value' },
								 { header: "Unit", width: 60, dataIndex: 'unit' },
								 { header: "Comment", width: 130, dataIndex: 'comment' }
							]),
						store: WATER_LEVEL_TAB.store/*,
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
			
			
		// Add water quality tab
		if (SITE.hasWaterQualityData(this.siteRecord)) {

			tabPanel.add(new Ext.Panel({
				id: 'water-quality-tab',
				title: 'Water Quality',
				autoScroll: true,
				isLoaded: false,
				listeners: {
					activate: function(p) {
						if (!p.isLoaded) {
							p.doLayout();
							p.isLoaded = true;
							WATER_QUALITY_TAB.store.removeAll();
							WATER_QUALITY_TAB.store.load({
								params:{siteNo:this.siteRecord.get('siteNo'),
										agency_cd:MEDIATOR.cleanAgencyCode(this.siteRecord.get('agency'))
								}
							});
						}
					},
					scope: this
				},
				items: [{
					xtype: 'grid',
					border: false,
					loadMask: true,
					autoHeight: true,
					width: 1450,
					viewConfig: {forceFit: true},
					 sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
					 colModel: new Ext.grid.ColumnModel([
							{ header: "Activity Start Date", width: 100, sortable: true, dataIndex: 'ActivityStartDate'},	                
							{ header: "Activity Start Time", width: 100, sortable: true, dataIndex: 'ActivityStartTime'},	                
							{ header: "Time Zone", width: 60, sortable: true, dataIndex: 'TimeZoneCode'},
							{ header: "Characteristic Name", width: 200, dataIndex: 'CharacteristicName'},
							{ header: "Measure Value", width: 80, sortable: true, dataIndex: 'ResultMeasureValue',
								renderer: function(value, metaData, record, rowIndex, colIndex, store) {
									if (value == '') {
										return 'Not Detected';
									}
									return value;
								}
							},
							{ header: "Units", width: 90, sortable: true, dataIndex: 'MeasureUnitCode'},
							{ header: "Detection Condition", width: 200, sortable: true, dataIndex: 'ResultDetectionConditionText'},
							{ header: "Value Type", width: 80, sortable: true, dataIndex: 'ResultValueTypeName'},
							{ header: "Sample Fraction", width: 80, sortable: true, dataIndex: 'ResultSampleFractionText'},
							{ header: "USGS P-Code", width: 70, sortable: true, dataIndex: 'USGSPCode'},
							{ header: 'Method Name', width: 180, sortable: true, dataIndex: 'MethodName'}
						]),
					store: WATER_QUALITY_TAB.store
				}]
			}));
		}		

	
		Ext.apply(this, {
			title: this.siteRecord.get('siteName'),
			items: [tabPanel],
			buttons: [{
				text: 'Download Data',
				handler: function() {
					SITE.downloadData(this.siteRecord)
				},
				scope: this
			},{
				text: 'Done',
				handler: function() {
					Ext.getCmp('identify-site-window').close();
				}
			}]
		});
		SiteIdentifyWindow.superclass.initComponent.call(this);
	}
});

var WATER_LEVEL_TAB = {
	mask: function(){this.getBody().mask('Loading...','x-mask-loading');},
	unmask: function(){this.getBody().unmask();},
	get: function() {return Ext.getCmp('water-level-tab');},
	getBody: function() {return this.get().body;}, 
	store : new Ext.data.XmlStore({						
		id: 'water-level-store',
		record: 'TimeValuePair',
		fields: [
		 		{ name: 'time', mapping: 'time', type: 'date', dateFormat: 'c'},
				{ name: 'value', mapping: 'value > Quantity > value'},
//				{ name: 'method', mapping: 'method'},
				{ name: 'unit', mapping: 'Quantity > uom@code'},
				{ name: 'comment', mapping: 'comment'}
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
	}),
	load: function(record) {
		WATER_LEVEL_TAB.mask();
		Ext.Ajax.request({
			method: 'GET',
			url: 'iddata?request=water_level',
			params: {
				siteNo: record.get('siteNo'),
				agency_cd: MEDIATOR.cleanAgencyCode(record.get('agency'))
			},
			
			success: function(r, o) {
				var rs = removeNameSpaces(r.responseText);
				WATER_LEVEL_TAB.store.loadData(DNH.createXmlDocFromString(rs));
				WATER_LEVEL_TAB.unmask();
			}
		});
	}
}



var WELL_LOG_TAB = {
	mask: function(){this.getBody().mask('Loading...','x-mask-loading');},
	unmask: function(){this.getBody().unmask();},
	get: function() {return Ext.getCmp('well-log-tab');},
	getBody: function() {return this.get().body;},
	update: function(htmlStr) { this.get().update(htmlStr);},
	createGraphic: function(so /* well log service object */){
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
					//graphicHTML += '<tr><td><span style="font-size: 80%;">' + (so.logObjs[i].intervalFrom * 3.2808399).toFixed(2) + ' ft</span></td></tr>'; 
					graphicHTML += '<tr><td><span style="font-size: 80%;">' + (so.logObjs[i].intervalFrom * 1.0).toFixed(2) + ' ft</span></td></tr>'; 
				}
				
				graphicHTML += '<tr><td style="height:' + relHeight + 'px; border: solid black 1px; width: 50px;">' + 
						'<div style="height: 100%; position: relative; ' + 
							'background-color: ' + intervalColor[(i%intervalColor.length)] + '; ' + 
							'color: ' + fontColor[(i%fontColor.length)] + 
						';">';

				//graphicHTML += '<span style="position: absolute; bottom: 0px; font-size: 80%;">' + (so.logObjs[i].intervalTo * 3.2808399).toFixed(2) + ' ft</span>' + 
				graphicHTML += '<span style="position: absolute; bottom: 0px; font-size: 80%;">' + (so.logObjs[i].intervalTo * 1.0).toFixed(2) + ' ft</span>' + 
						'</div>' + 
					'</td>' + 
					'<td style="height:' + relHeight + 'px; padding-left: 5px;" valign="middle">' + 
						so.logObjs[i].description + 
					'</td></tr>';
			}
			graphicHTML += '</table>';
		}
		return graphicHTML;
	},
	populateServiceObjectFromXML: function(x /* xml document from createXmlDocFromString()*/){
		var so = {
				position: DNH.extractValue(x, 'pos'),
				elevation: DNH.extractValue(x,'referenceElevation'),
				wellDepth: DNH.extractValue(x,'principalValue'),
				onlineResource: DNH.extractValue(x,'onlineResource','xlink:href'),
				onlineResourceTitle: DNH.extractValue(x,'onlineResource','xlink:title')
			};
			
			var logEls = x.getElementsByTagName('logElement');
			so.logObjs = [];
			for (var i = 0; i < logEls.length; i++) {
				try{
					var coords = DNH.extractValue(logEls[i],'coordinates').split(' ');
					var f = coords[0];
					var t = coords[1];
					var desc = logEls[i].getElementsByTagName('description');
					var controlledConcept = logEls[i].getElementsByTagName('name').nodeValue;
					
					so.logObjs.push({
						intervalFrom: f,
						intervalTo: t,
						height: t - f,
						contrConcept: controlledConcept,
						description: (desc)?desc[0].firstChild.nodeValue : 'No Description'
					});
				} catch(err){
					// Don't do anything
				}
			}
			
			var constrEls = x.getElementsByTagName('construction');
			so.constrObjs = [];
			for (var i = 0; i < constrEls.length; i++) {
				try{
					var coords = DNH.extractValue(constrEls[i],'coordinates').split(' ');
					var f = coords[0];
					var t = coords[1];
					var desc = constrEls[i].getElementsByTagName('value');
					
					so.constrObjs.push({
						intervalFrom: f,
						intervalTo: t,
						height: t - f,
						description: (desc)? desc[0].firstChild.nodeValue : 'No Description'
					});
				} catch(err){
					// Don't do anything
				}
			}
		return so;
	},
	onSuccess: function(r, o) {
		try {
			WELL_LOG_TAB.unmask();
			var rs = removeNameSpaces(r.responseText);
			var x = DNH.createXmlDocFromString(rs);
			
			if (DNH.isEmptyOrNull(x,'pos')) {
				WELL_LOG_TAB.update('<h1>No Data Found. Service may be down or unavailable</h1>');
				return;
			}
			
			var so = WELL_LOG_TAB.populateServiceObjectFromXML(x);
			so.graphicHTML = WELL_LOG_TAB.createGraphic(so);

			wellLogTemplate.overwrite(WELL_LOG_TAB.getBody(), so);
		} catch (err){
			// TODO log this
			WELL_LOG_TAB.update('<h1>Problem loading data</h1>');
		}

	},
	load: function (record) {
		WELL_LOG_TAB.mask();
		Ext.Ajax.request({
			method: 'GET',		
			url: 'iddata?request=well_log',
			params: {
					siteNo: record.get('siteNo'), //siteNo: 425856089320601
					agency_cd: MEDIATOR.cleanAgencyCode(record.get('agency'))
				},
			success: WELL_LOG_TAB.onSuccess
		});
	}
}
var WATER_QUALITY_TAB = {
		store: new Ext.data.XmlStore({
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
			    { name: 'USGSPCode', mapping: 'ResultDescription > USGSPCode'},
			    { name: 'MethodName', mapping: 'ResultAnalyticalMethod > MethodName'}
			]
		})
		//ActivityStartDate, ActivityStartTime, TimeZoneCode, CharacteristicName, ActivityMediaSubdivisionName, 
		//ResultSampleFractionTest, ResultMeasureValue, ResultDetectionConditionText, MeasureUnitCode, 
		//ResultValueTypeName, USGSPCode
	}



