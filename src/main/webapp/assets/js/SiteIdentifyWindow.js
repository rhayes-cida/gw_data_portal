var siteIdTpl = new Ext.XTemplate(
	'<tpl for=".">',
		'<div id="id-container">',
			'<table width="100%" border="1">',
				'<tr><td>Groundwater ID</td><td>{gwuId}</td></tr>',
				'<tr><td>Lat/Long(WGS84)</td><td>{LATWGS84},{LONGWGS84}</td></tr>',
				'<tr><td>Well Monitoring Purpose Type</td><td>{wellMonitoringPurposeType}</td></tr>',
				'<tr><td>National Aquifer Name</td><td>{nationalAquiferName}</td></tr>',
				'<tr><td>Organization Id</td><td>{organizationId}</td></tr>',
			'</table><br/><br/><br/>',
		'</div>',
	'</tpl>'
);
siteIdTpl.compile();


var SiteIdentifyWindow = Ext.extend(Ext.Window, {
	id: 'identify-site-window',
	height: 250,
	width: 700,
	modal: true,
	layout: 'fit',
	initComponent: function() {
		Ext.apply(this, {
			title: this.siteRecord.get('gwuId'),
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