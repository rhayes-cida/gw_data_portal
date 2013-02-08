var IDENTIFY = function (){
	var _fieldsArray = ['SITE_NO','SITE_NAME','DEC_LAT_VA','DEC_LONG_VA','QW_WELL_TYPE','QW_WELL_CHARS','WL_WELL_TYPE','WL_WELL_CHARS','WELL_DEPTH','LOCAL_AQUIFER_NAME','NAT_AQFR_DESC','AGENCY_CD','AGENCY_NM','WL_SN_FLAG','QW_SN_FLAG','LINK',
			             'WL_DATA_FLAG','QW_DATA_FLAG','LOG_DATA_FLAG','STATE_CD'];
	
	return {
		fieldsArray : _fieldsArray,
			             
		store : new Ext.data.ArrayStore({
			proxy: new Ext.data.HttpProxy({
				method: 'GET',
			    url: 'identify'		
			}),
		    autoDestroy: false,
		    storeId: 'myStore',
		    fields: _fieldsArray
		}),
		
		loadOpenlayersRecordIntoStore : function(records) {
			var recordsArray = [];
			for(var i = 0; i < records.length; i++) {
				var record = [];
				for(var j = 0; j < _fieldsArray.length; j++){
					record.push(records[i].data[_fieldsArray[j]])
				}
				recordsArray.push(record);
			}
			IDENTIFY.store.loadData(recordsArray);
		},
		
		identifyLatLon: function(map, e) {
			Ext.getCmp('cmp-map-area').body.mask('Finding nearby point(s).  Please wait...', 'x-mask-loading');
			
			var pixelClicked = e.xy;
			
			var clickLLMax = map.getLonLatFromPixel(new OpenLayers.Pixel(pixelClicked.x + 10, pixelClicked.y + 10)).transform(GWDP.ui.map.mercatorProjection,GWDP.ui.map.wgs84Projection);
			var clickLLMin = map.getLonLatFromPixel(new OpenLayers.Pixel(pixelClicked.x - 10, pixelClicked.y - 10)).transform(GWDP.ui.map.mercatorProjection,GWDP.ui.map.wgs84Projection);
			
			var filters = { //TODO actually filter!
					AGENCY_CD: '',
					ntlAquiferName: '',	
					qwSnFlag:	'1',
					qwWellType: '',	
					wlSnFlag:	'1',
					wlWellType: ''	
					}; //filters
			
			var bbox = clickLLMin.lon + "," + clickLLMax.lat + "," + clickLLMax.lon + "," + clickLLMin.lat;
			
			GWDP.domain.Well.getWells(bbox, filters, function(r){
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
					IDENTIFY.loadOpenlayersRecordIntoStore(r);
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
					IDENTIFY.loadOpenlayersRecordIntoStore(r);
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
				border: false,
				autoScroll: true,
				viewConfig: {forceFit: true},
			    sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
			    colModel: new Ext.grid.ColumnModel([
					{ header: "Site Name", width: 250, dataIndex: 'SITE_NAME'},
					{ header: "Ntl Aquifer Name", width: 150, sortable: true, dataIndex: 'NAT_AQFR_DESC'},
					{ header: "Agency", width: 100, sortable: true, dataIndex: 'AGENCY_CD'}	                
	            ])
			},
			buttons: [{
				text: 'Show Summary For Site',
				handler: function() {
					var grid = Ext.getCmp('sites-grid');
					var siteRecord = grid.getSelectionModel().getSelected();
					//open ID window
					if (siteRecord) {
						GoogleAnalyticsUtils.logSiteIdentifyByStation(siteRecord.data.AGENCY_CD + ":" + siteRecord.data.SITE_NO);
						(new SiteIdentifyWindow({siteRecord: siteRecord})).show();
					} else {
						Ext.Msg.show({
							title:'Error',
							msg: 'Click on a site in the grid, then click the "identify" button.',
							buttons: Ext.Msg.OK,
							icon: Ext.MessageBox.WARNING
						});
					}
				}
			}]
		});
		SiteIdSelectorPopup.superclass.initComponent.call(this);
	}
});