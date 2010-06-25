var siteIdTpl = new Ext.XTemplate(
	'<tpl for=".">',
		'<div id="id-container">',
			'<table width="100%" border="1">',
				'<tr><th colspan="2">RESULT INFORMATION (FOR SPECIFIED TIME PERIOD)</th></tr>',
				'<tr><td>PARAMETER CODE</td><td>{parameterCode}</td></tr>',
				'<tr><td>PARAMETER NAME</td><td>{parameterName}</td></tr>',
				'<tr><td>MEDIAN VALUE AT SITE</td><td>{aggregateVa}</td></tr>',
				'<tr><td>VALUE RANGE AT SITE</td><td>{minValue} to {maxValue}</td></tr>',
				'<tr><td># OF SAMPLES AT SITE</td><td>{numSamples}</td></tr>',
				'<tr><td>SAMPLE COLLECTION TIME PERIOD</td><td>{firstSampleDate} to {lastSampleDate}</td></tr>',
				'<tr><td>REPORTING UNITS</td><td>{reportUnits}</td></tr>',
				'<tr><th colspan="2">ADDITIONAL CONSTITUENT INFORMATION</th></tr>',
				'<tr><td>PRIMARY LAB SCHEDULE</td><td>{primaryScheduleName}</td></tr>',
			'</table><br/><br/><br/>',
			'<table width="100%" border="1">',
				'<tr><th colspan="2">STUDY INFORMATION</th></tr>',
				'<tr><td>NAWQA Study Unit</td><td>{suDesc}</td></tr>',
				'<tr><td>Study Cycle I Start</td><td>{suYear}</td></tr>',
				'<tr><td>Study Cycle II Start</td><td>{suYearCy2}</td></tr>',
				'<tr><th colspan="2">ADDITIONAL STUDY INFORMATION</th></tr>',
				'<tr><td>Study Website</td><td><a href="http://water.usgs.gov/lookup/get?{suId}" target=_"blank">Link</a></td></tr>',
			'</table><br/><br/><br/>',
			'<table width="100%" border="1">',
				'<tr><th colspan="2">SITE INFORMATION</th></tr>',
				'<tr><td>Station Name</td><td>{placeName}</td></tr>',
				'<tr><td>Site Type</td><td>{siteTypeDesc}</td></tr>',
				'<tr><td>Agency</td><td>{agencyCode}</td></tr>',
				'<tr><td>Station ID</td><td>{stationId}</td></tr>',
				'<tr><td>State</td><td>{stateName}</td></tr>',
				'<tr><td>County</td><td>{countyName}</td></tr>',
				'<tr><td>Latitude (NAD83)</td><td>{lat83}</td></tr>',
				'<tr><td>Longitude (NAD83)</td><td>{long83}</td></tr>',
				'<tr><td>Represented Land Use</td><td>{specificLandUse}</td></tr>',
				'<tr><th colspan="2">ADDITIONAL SITE INFORMATION</th></tr>',
				'<tr><td>Summary of all available USGS data</td><td><a href="http://waterdata.usgs.gov/nwis/inventory/?site_no={stationId}" target="_blank">Link</a></td></tr>',
			'</table>',
		'</div>',
	'</tpl>'
);
siteIdTpl.compile();


var SiteIdentifyWindow = Ext.extend(Ext.Window, {
	id: 'identify-site-window',
	height: 400,
	width: 700,
	modal: true,
	layout: 'fit',
	initComponent: function() {
		Ext.apply(this, {
			title: 'Station Name: ' + this.siteRecord.data.placeName + "; Station ID: " + this.siteRecord.data.stationId,
			items: [{
				border: false,
				xtype: 'tabpanel',
				record: this.siteRecord,
				activeTab: 0,
				items :[{
					title: 'Site Information',
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
				},{
					title: 'Site Summary',
					border: false,
					bodyStyle: 'padding: 5px',
					autoScroll: true,
					record: this.siteRecord,
					autoLoad: {url: 'sitesummary', params: 'place_id=' + this.siteRecord.data.placeId}
				}]
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