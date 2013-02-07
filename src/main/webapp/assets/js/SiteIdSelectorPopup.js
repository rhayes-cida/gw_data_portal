var IDENTIFY = {
	store : new Ext.data.JsonStore({
		proxy: new Ext.data.HttpProxy({
			method: 'GET',
		    url: 'identify'		
		}),
	    autoDestroy: false,
	    storeId: 'myStore',
	    root: 'sites',
	    fields: ['siteNo','siteName','decLatVa','decLongVa','qwWellType','wlWellType','wellDepth','localAquiferName','nationalAquiferName','agency','agencyName','wlSnFlag','qwSnFlag','logo','link','linkDesc',
	             'wlDataFlag','qwDataFlag','logDataFlag']
	}),
	
	identifyLatLon: function(map, e) {
		Ext.getCmp('cmp-map-area').body.mask('Finding nearby point(s).  Please wait...', 'x-mask-loading');
		
		var pixelClicked = e.xy;
		
		var clickLLMax = map.getLonLatFromPixel(new OpenLayers.Pixel(pixelClicked.x + 10, pixelClicked.y + 10)).transform(GWDP.ui.map.mercatorProjection,GWDP.ui.map.wgs84Projection);
		var clickLLMin = map.getLonLatFromPixel(new OpenLayers.Pixel(pixelClicked.x - 10, pixelClicked.y - 10)).transform(GWDP.ui.map.mercatorProjection,GWDP.ui.map.wgs84Projection);
		var idBBox = clickLLMin.lon + "," + clickLLMin.lat + "," + clickLLMax.lon + "," + clickLLMax.lat;
		
		var idParams = { //TODO actually filter!
				agency: '',
				ntlAquiferName: '',	
				qwSnFlag:	'1',
				qwWellType: '',	
				wlSnFlag:	'1',
				wlWellType: ''	
				}; //filters
		
		idParams.idBBox = idBBox;
		
		IDENTIFY.store.load({
			params: idParams,
			callback: function(r, o, s) {
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
					//auto id the one site
					var siteRecord = r[0];
					// we don't want null sitenames
					siteRecord.data.siteName = SITE.createName(siteRecord.data.siteName, siteRecord.data.agency, siteRecord.data.siteNo);
					//open ID dialog with site record
					GoogleAnalyticsUtils.logSiteIdentifyUsed();
					GoogleAnalyticsUtils.logSiteIdentifyByStation(siteRecord.data.agency + ":" + siteRecord.data.siteNo);
					(new SiteIdentifyWindow({siteRecord: siteRecord})).show();
				} else {
					for (var j=0; j<r.length; j++){
						var siteRecord = r[j];
						siteRecord.data.siteName = SITE.createName(siteRecord.data.siteName, siteRecord.data.agency, siteRecord.data.siteNo);
					}
					//open site selection window
					GoogleAnalyticsUtils.logSiteIdentifyUsed();
					GoogleAnalyticsUtils.logSiteIdentifySet(IDENTIFY.store.getTotalCount());
					(new SiteIdSelectorPopup({store: IDENTIFY.store})).show();
				}
			}
		});
	}

}

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
					{ header: "Site Name", width: 250, dataIndex: 'siteName'},
					{ header: "Ntl Aquifer Name", width: 150, sortable: true, dataIndex: 'nationalAquiferName'},
					{ header: "Agency", width: 100, sortable: true, dataIndex: 'agency'}	                
	            ])
			},
			buttons: [{
				text: 'Show Summary For Site',
				handler: function() {
					var grid = Ext.getCmp('sites-grid');
					var siteRecord = grid.getSelectionModel().getSelected();
					//open ID window
					if (siteRecord) {
						GoogleAnalyticsUtils.logSiteIdentifyByStation(siteRecord.data.agency + ":" + siteRecord.data.siteNo);
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