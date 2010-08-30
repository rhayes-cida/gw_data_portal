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
				autoLoad: 'iddata?request=well_log&siteNo=' + this.siteRecord.get('siteNo')
			}));
			
			//add water level
			if (this.siteRecord.get('wlSnFlag').toUpperCase() == 'YES') {
				tabPanel.add(new Ext.Panel({
					title: 'Water Levels',
					autoLoad: 'iddata?request=water_level&siteNo=' + this.siteRecord.get('siteNo')
				}));
			}
			
			//add water quality
			if (this.siteRecord.get('qwSnFlag').toUpperCase() == 'YES') {
				tabPanel.add(new Ext.Panel({
					title: 'Water Quality',
					autoLoad: 'iddata?request=water_quality&siteNo=' + this.siteRecord.get('siteNo')
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