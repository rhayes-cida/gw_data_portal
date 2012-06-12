var DOWNLOAD_SITES = {
	store : new Ext.data.JsonStore({
		proxy: new Ext.data.HttpProxy({
			method: 'GET',
		    url: 'identify'		
		}),
	    autoDestroy: false,
	    storeId: 'myStore',
	    root: 'sites',
	    fields: ['siteName','siteNo','agency','nationalAquiferName']
	}),
	// sites: [],
	loading: false,
	find: function(map,mapState) {

		DOWNLOAD_SITES.loading = true;
				
		var idBBox = map.getViewportBoundingBoxString();
		
		var idParams = mapState;
		idParams.idBBox = idBBox;
		
		DOWNLOAD_SITES.store.load({
			params: idParams,
			callback: function(r, o, s) {
				// sites = r;
				for (var j=0; j<r.length; j++){
					var siteRecord = r[j];
					siteRecord.data.siteName = SITE.createName(siteRecord.data.siteName, siteRecord.data.agency, siteRecord.data.siteNo);
				}
				DOWNLOAD_SITES.loading = false;
				var win = Ext.getCmp('multisite-download-window');
				if (win) {
					win.setTitle(DOWNLOAD_SITES.store.getCount() + ' sites were identified.');
					win.enable();
					// TODO how to redisplay to get updated site names?
					// win.unmask();
				} else {
					alert('no download window to enable');
				}
			}
		});
	}

};

var MultisiteDownloadForm = Ext.extend(Ext.form.FormPanel,{
	standardSubmit: true,
	method: 'POST',
	hidden: true,
	clientValidation: false,
	url: '/gw_data_portal/data',
	target: "_blank",
	addItem: function(n,v) {
		var form = this.getForm();
		
		var dom = form.el.dom;
		var document = dom.ownerDocument;
		
		var input = document.createElement("input");
		input.setAttribute("type", "hidden");
		input.setAttribute("name", n);
		input.setAttribute("value", v);

		dom.appendChild(input);
	},
	// Workaround as the standardSubmit config item does not seem to be getting 
	// propagated through to the new child object, which means the EXT submit
	// method does the wrong thing.
	formSubmitToTarget: function(tgt) {
		var form = this.getForm();
		
		var dom = form.el.dom;
		dom.target = tgt;

        if(this.url && Ext.isEmpty(dom.action)){
            dom.action = this.url;
        }
        dom.submit();
	}
});

var DownloadPopup = Ext.extend(Ext.Window, {
	id: 'multisite-download-window',
	title: 'Multi-site Download',
	height: 200,
	width: 650,
	layout: 'fit',
	modal: true,
	store: DOWNLOAD_SITES.store,
	disabled: DOWNLOAD_SITES.loading,

	//resizable: false,
	initComponent: function() {
		
		this.msdlf = new MultisiteDownloadForm();
		
		var myMsdlf = this.msdlf;

		Ext.Ajax.request({
			url: 'settings',
			success: function(result,request) {
				var jsonData = Ext.util.JSON.decode(result.responseText);
                Ext.apply(this.msdlf, {
                	url: jsonData.cacheBase
                });
			},
			failure: function(result,request) {
				alert("failed to get settings from server");
			}
		});

		Ext.apply(this, {
			title: this.store.getCount() + ' sites were identified.',
			items: [
			        {
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
			        myMsdlf
			        ],
			buttonAlign: 'left', 
			buttons: [
			{
				xtype: 'checkboxgroup',
				// layout: 'fit',
				width: 400, 
				fieldLabel: 'Download: ',
				items: [
					{
						boxLabel: 'Water Level',
						name: 'wl', id: 'dtype_wl'
					},          
					{
						boxLabel: 'Water Quality',
						name:'qw', id: 'dtype_qw'
					},
					{
						boxLabel: 'Construction',
						name: 'construction', id: 'dtype_const'
					},
					{
						boxLabel: 'Lithology',
						name:'lithology', id : 'dtype_lith'
					},
				]
			},
					   
			'->',
					          
			{
					text: 'Download data',
					handler: function() {
						var dlUrl = "http://emeraldcity.au/data";
						var params = [];
						
						// start with list of types
						if (Ext.getCmp('dtype_wl').getValue()) {
							params.push("type=WATERLEVEL");
						}
						if (Ext.getCmp('dtype_qw').getValue()) {
							params.push("type=QUALITY");
						}
						if (Ext.getCmp('dtype_const').getValue() || Ext.getCmp('dtype_lith').getValue()) {
							params.push("type=LOG");
						}
						
						if (params.length == 0) {
							alert("No data type chosen. Fail.");
						}
						
						var sites = DOWNLOAD_SITES.store.getRange();
						for (var j = 0; j < sites.length; j++) {
							var siteRecord = sites[j];
							
							var wellID = siteRecord.data.agency + ":" + siteRecord.data.siteNo;
							wellID = wellID.trim();
							wellID = wellID.replace(/ /g, "+");
							params.push("featureID=" + wellID);
						}
						
						if (false) {
							var url = dlUrl + '?' + params.join('&');
							var displayUrl = url;
							if (url.length > 80) {
								displayUrl = url.substring(0,75) + '...[' + url.length + ']';
							}
							alert('download ' + displayUrl);
						}

						myMsdlf.items.clear();
						var form = myMsdlf.getForm();
						for (var k = 0; k < params.length; k++) {
							var s = params[k];
							var vv = s.split('=');
							
							myMsdlf.addItem(vv[0],vv[1]);
						}
						myMsdlf.formSubmitToTarget('_blank');
						
						// TODO Close? Or use tracking window from SiteIdentifyWindow?
					}
			}]
		});
		
		
		DownloadPopup.superclass.initComponent.call(this);
	}
});
