var siteIdTpl = new Ext.XTemplate(
	'<tpl for=".">',
		'<div id="id-container">',
			'<table width="100%" border="1">',
				'<tr><td>Site Name</td><td>{siteName}</td></tr>',
				'<tr><td>Site #</td><td>{siteNo}</td></tr>',
				'<tr><td>Lat/Long(WGS84)</td><td>{decLatVa},{decLongVa}</td></tr>',
				'<tr><td>QW Well Type</td><td>{qwWellType}</td></tr>',
				'<tr><td>Water Level Well Type</td><td>{wlWellType}</td></tr>',
				'<tr><td>National Aquifer Name</td><td>{nationalAquiferName}</td></tr>',
				'<tr><td>Agency</td><td>{agency}</td></tr>',
			'</table><br/><br/><br/>',
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
		Ext.apply(this, {
			title: this.siteRecord.get('siteName'),
			items: [{
				id: 'site-id-panel',
				record: this.siteRecord,
				border: false,
				//autoScroll: true,
				layout: 'anchor',
				bodyStyle: 'padding: 5px',
				listeners: {
					afterrender: function(p) {
						siteIdTpl.overwrite(p.body, p.record.data);
					}
				}
			}],
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