Ext.onReady(function() {
	
	//create the EXTJS layout
	new Ext.Panel({
		id: 'ext-content-panel',
		renderTo: 'content',
		layout: 'border',
		height: 1300,
		width: 800,
		border: false,
		plain: true,
		style: 'text-align: left',
		items: [{
			region: 'center',
			id: 'application-area',
			layout: 'border',
			border: false
		}, {
			region: 'west',
			items: [{
				xtype: 'fieldset',
				title: 'Organization ID',
				contentEl: 'orgId-div'
			},{
				xtype: 'fieldset',
				title: 'Well Monitoring Purpose Type',
				contentEl: 'wellMonitoring-div'
			},{
				xtype: 'fieldset',
				title: 'National Aquifer Name',
				contentEl: 'ntlAquifer-div'
			}]
		}]
	});
});