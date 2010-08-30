var identifyStore = new Ext.data.JsonStore({
	proxy: new Ext.data.HttpProxy({
		method: 'GET',
	    url: 'identify'		
	}),
    autoDestroy: false,
    storeId: 'myStore',
    root: 'sites',
    fields: ['siteNo','siteName','decLatVa','decLongVa','qwWellType','wlWellType','nationalAquiferName','agency','wlSnFlag','qwSnFlag','logo']
});


function identifyPoint(event, map) {

	Ext.getCmp('cmp-map-area').body.mask('Finding nearby point(s).  Please wait...', 'x-mask-loading');
	//Ext.getCmp('ext-content-panel').body.mask();

	var c = JMap.util.getRelativeCoords(event, map.pane);
	var mapCoords = map.getMapCoordsInPixelSpace();
	
	var clickLLMax = map.getLatLonFromPixel(mapCoords.x + c.x + 10, mapCoords.y + (map.viewportHeight - c.y) + 10);
	var clickLLMin = map.getLatLonFromPixel(mapCoords.x + c.x - 10, mapCoords.y + (map.viewportHeight - c.y) - 10);
	var idBBox = clickLLMin.lon + "," + clickLLMin.lat + "," + clickLLMax.lon + "," + clickLLMax.lat;
	
	var idParams = mapState;
	idParams.idBBox = idBBox;
	
	identifyStore.load({
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
				//open ID dialog with site record
				(new SiteIdentifyWindow({siteRecord: siteRecord})).show();
			} else {
				//open site selection window
				(new SiteIdSelector({store: identifyStore})).show();
			}
		}
	});
}

var SiteIdSelector = Ext.extend(Ext.Window, {
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
		SiteIdSelector.superclass.initComponent.call(this);
	}
});