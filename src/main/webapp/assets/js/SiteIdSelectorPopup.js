var IDENTIFY = function (){
	var _fieldsArray = GWDP.domain.Well.fields; //identifying wells
	
	return {
		fieldsArray : _fieldsArray,
			             
		store : GWDP.domain.getArrayStore(_fieldsArray, 'identify'),
		
		identifyLatLon: function(map, e) {
			Ext.getCmp('cmp-map-area').body.mask('Finding nearby point(s).  Please wait...', 'x-mask-loading');
			
			var cql_filters = GWDP.ui.getCurrentFilterCQLAsString(GWDP.ui.getFilterFormValues());
			
			var bbox = GWDP.ui.map.getBBOXAroundPoint(map, e);
			
			GWDP.domain.Well.getWells(GWDP.ui.map.baseWFSServiceUrl, bbox, cql_filters, function(r){
				Ext.getCmp('cmp-map-area').body.unmask();
				//Ext.getCmp('ext-content-panel').body.unmask();
				if (r.length == 0) {
					//no sites found
					Ext.Msg.show({
					   title:'No Sites Identified',
					   msg: 'No sites were found near the point you clicked.',
					   buttons: Ext.Msg.OK,
					   icon: Ext.MessageBox.WARNING
					});
				} else if (r.length == 1) {
					GWDP.domain.loadOpenlayersRecordIntoArrayStore(r, IDENTIFY.store);
					var siteRecord = IDENTIFY.store.getAt(0);
					// we don't want null sitenames
					siteRecord.data.SITE_NAME = SITE.createName(siteRecord.data.SITE_NAME, siteRecord.data.AGENCY_CD, siteRecord.data.SITE_NO);
					//open ID dialog with site record
					GoogleAnalyticsUtils.logSiteIdentifyUsed();
					GoogleAnalyticsUtils.logSiteIdentifyByStation(siteRecord.data.AGENCY_CD + ":" + siteRecord.data.SITE_NO);
					(new SiteIdentifyWindow({siteRecord: siteRecord})).show();
				} else {
					for (var j=0; j<r.length; j++){
						var siteRecord = r[j];
						siteRecord.data.SITE_NAME = SITE.createName(siteRecord.data.SITE_NAME, siteRecord.data.AGENCY_CD, siteRecord.data.SITE_NO);
					}
					GWDP.domain.loadOpenlayersRecordIntoArrayStore(r, IDENTIFY.store);
					GoogleAnalyticsUtils.logSiteIdentifyUsed();
					GoogleAnalyticsUtils.logSiteIdentifySet(IDENTIFY.store.getTotalCount());
					(new SiteIdSelectorPopup({store: IDENTIFY.store})).show();
				}
			});
		}
	}
}();

var SiteIdSelectorPopup = Ext.extend(Ext.Window, {
	id: 'select-site-window',
	height: 200,
	width: 650,
	layout: 'fit',
	modal: true,
	//resizable: false,
	initComponent: function() {
		Ext.apply(this, {
			title: this.store.getTotalCount() + ' sites were identified nearby. Select one...',
			items: {
				id: 'sites-grid',
				xtype: 'grid',
				store: this.store,
	        	enableHdMenu: false,
				border: false,
				autoScroll: true,
				viewConfig: {forceFit: true},
			    sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
			    colModel: new Ext.grid.ColumnModel([
			        { header: "Agency", width: 100, sortable: true, dataIndex: 'AGENCY_CD'},         
					{ header: "Site No", width: 100, dataIndex: 'SITE_NO'},   
					{ header: "Site Name", width: 250, dataIndex: 'SITE_NAME'},
					{ header: "Principal Aquifer", width: 150, sortable: true, dataIndex: 'NAT_AQFR_DESC'}
	            ]),
	            listeners:{
	            	rowdblclick: function(grid, rowIndex, e) {
	            		var record = grid.store.getAt(rowIndex);
						(new SiteIdentifyWindow({siteRecord: record})).show();
	    				Ext.getCmp('select-site-window').close();
	            	}
	            }
			},
			buttons: [{
				text: 'SELECT ALL FOR DOWNLOAD',
				handler: function() {
					var grid = Ext.getCmp('sites-grid');
					GWDP.ui.map.siteSelector.addSitesFromStore(grid.store);
    				if(GWDP.ui.map.siteSelector.store.getCount()>0) {
    					GWDP.ui.map.siteSelector.maximizeControl();
    				}
    				Ext.getCmp('select-site-window').close();
				}
			}]
		});
		SiteIdSelectorPopup.superclass.initComponent.call(this);
	}
});