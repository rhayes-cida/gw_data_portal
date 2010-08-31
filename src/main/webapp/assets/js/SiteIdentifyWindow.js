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
				title: 'Well Log',
				//autoLoad: 'iddata?request=well_log&siteNo=' + this.siteRecord.get('siteNo')
				autoLoad: {
					url: 'iddata?request=well_log&siteNo=' + this.siteRecord.get('siteNo'),
					method: 'GET',
					callback: function(e,s,r,o) {
						
					}
				}
			}));
			
			//add water level
			if (this.siteRecord.get('wlSnFlag').toUpperCase() == 'YES') {
				tabPanel.add(new Ext.Panel({
					title: 'Water Levels',
					//autoLoad: 'iddata?request=water_level&siteNo=' + this.siteRecord.get('siteNo')
					autoLoad: {
						url: 'iddata?request=water_level&siteNo=' + this.siteRecord.get('siteNo'),
						method: 'GET',
						callback: function(e,s,r,o) {
							new Ext.data.XmlStore({
								record: 'Result',
								data: r.responseXml,
								fields: [
									    { name: 'CharacteristicName', mapping: 'ResultDescription > CharacteristicName'},
									    { name: 'ResultSampleFractionText', mapping: 'ResultDescription > ResultSampleFractionText'},
									    { name: 'ResultMeasureValue', mapping: 'ResultDescription > ResultMeasure > ResultMeasureValue'},
									    { name: 'MeasureUnitCode', mapping: 'ResultDescription > ResultMeasure > MeasureUnitCode'},
									    { name: 'USGSPCode', mapping: 'ResultDescription > USGSPCode'}
								],
								listeners: {
									load: function(s,r,o) {
										//s.data
									}
								}
							});
						},
						scope: this
					}
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