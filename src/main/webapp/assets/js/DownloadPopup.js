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
		DOWNLOAD_SITES.store.removeAll();
		var win = Ext.getCmp('multisite-download-window');
		if (win) {
			win.setTitle('Identifying sites');
		}
		
		var idBBox = map.getViewportBoundingBoxString();
		
		var idParams = mapState;
		idParams.idBBox = idBBox;
		
		DOWNLOAD_SITES.store.load({
			params: idParams,
			add: false,
			callback: function(r, o, s) {
				// sites = r;
				for (var j=0; j<r.length; j++){
					var siteRecord = r[j];
					siteRecord.data.siteName = SITE.createName(siteRecord.data.siteName, siteRecord.data.agency, siteRecord.data.siteNo);
				}
				DOWNLOAD_SITES.loading = false;
				if (r.length == 0) {
					alert_no_sites();					
					return;
				}
				
				var win = Ext.getCmp('multisite-download-window');
				if (win) {
					win.setTitle(DOWNLOAD_SITES.store.getCount() + ' sites were identified.');
					win.enable();
					// force redisplay to make sure sites are shown
					win.doLayout(false, true);
				} else {
					alert('no download window to enable');
				}
			}
		});
	}

};

function alert_no_sites() {
	var nosites = Ext.getCmp('multisite-nosite-window');
	
	if (nosites) {
		nosites.show();
	} else {
		alert('No sites identified. Please use map controls to display sites');
	}
}

//use a less common namespace than just 'log'
function log_it(msg)
{
    // attempt to send a message to the console
    try
    {
        console.log(msg);
    }
    // fail gracefully if it does not exist
    catch(e){}
}

var settingsData = null;
Ext.Ajax.request({
	url: 'settings',
	success: function(result,request) {
		var jsonData = Ext.util.JSON.decode(result.responseText);
		settingsData = jsonData;
	},
	failure: function(result,request) {
		alert("failed to get settings from server");
	}
});


var MultisiteDownloadForm = Ext.extend(Ext.form.FormPanel,{
	standardSubmit: true,
	method: 'POST',
	hidden: true,
	clientValidation: false,
	url: '/gw_data_portal/data',
	// target: "_blank",
	
	// TODO Does this need to be part of the formSubmit method? What is the scope of the form instance?
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
	
	clearItems: function() {
		var form = this.getForm();
		
		form.items.clear();
		var dom = form.el.dom;
		while (dom.hasChildNodes()) {
			dom.removeChild(dom.lastChild);
		}
	},
	
	// Workaround as the standardSubmit config item does not seem to be getting 
	// propagated through to the new child object, which means the EXT submit
	// method does the wrong thing.
	formSubmitToTarget: function(tgt) {
		var form = this.getForm();
		var token = (new Date()).getTime();

		var dom = form.el.dom;
		if (tgt) {
			dom.target = tgt;
		}

		if (settingsData) {
			this.url = settingsData.cacheBase;
		}
        if(this.url && Ext.isEmpty(dom.action)){
            dom.action = this.url;
        }
        
        this.addItem('downloadToken', token);
        this.addItem('bundled','true');
        
		//pop up a new window that displays progress of download
        var downloadWindow = null;
		downloadWindow = new Ext.Window({
			height: 200,
			width: 300,
			resizable: false,
			title: 'Downloading Data...',
			modal: true,
			layout: 'border',
			closable: false,
			items: [{
				border: false,
				region: 'center',
				html: ''
			}],
			buttonAlign: 'center',
			buttons: [{
				text: 'Cancel',
				handler: function() {
					Ext.Msg.show({
						title:'Warning',
						msg: 'Cancel the download?',
						buttons: Ext.Msg.YESNO,
						fn: function(bid) {
							if (bid == 'yes' && downloadWindow) {
								downloadWindow.close();
							}
						},
						icon: Ext.MessageBox.QUESTION
					});
				},
				scope: this
			}]
		});
		
		downloadWindow.show();
		downloadWindow.body.mask('Please wait...','x-mask-loading');

		Ext.util.Cookies.clear('downloadToken');

		var triesLeft = 10;
		var exportStatus = null;
		exportStatus = setInterval(function() {
			var cookieValue = Ext.util.Cookies.get('downloadToken');
			if (cookieValue == token || (--triesLeft <= 0)) {
				// Ext.util.Cookies.clear('downloadToken');
				downloadWindow.body.unmask();
				downloadWindow.close();
				clearInterval(exportStatus);
			} else if (cookieValue) {
				log_it('funkychicken ' + cookieValue);
			}
		}, 1000);

        dom.submit();
        
        // must reset DOM form to clear out the appended input children
        this.clearItems();
	}
});

var DownloadHelpPopup = Ext.extend(Ext.Window, {
	id: 'download-help-window',
	height: 400,
	width: 780,
	modal: true,
	closeAction: 'hide',
	title: 'Download Help',
	bodyCssClass: 'help',
	autoLoad: {
		url: 'DownloadHelp.html',
		loadScripts: false
	}
});
var dlHelpWindow = new DownloadHelpPopup();

var NoSitesPopup = Ext.extend(Ext.Window, {
	id: 'multisite-nosite-window',
	title: 'No Sites Identified',
	height: 200,
	width: 650,
	modal: true,
	closeAction: 'hide',
	bodyCssClass: 'help',
	autoLoad: {
		url: 'DownloadNosites.html',
		loadScripts: false
	}
});
var nositesPopupWindow = new NoSitesPopup();

var DownloadPopup = Ext.extend(Ext.Window, {
	id: 'multisite-download-window',
	title: 'Multi-site Download',
	height: 200,
	width: 650,
	layout: 'fit',
	modal: true,
	closable: true,
	closeAction: 'hide',
	store: DOWNLOAD_SITES.store,
	disabled: DOWNLOAD_SITES.loading,
	tools: [{
		id: 'help',
		qtip: 'Help on Download',
		handler: function() {
			dlHelpWindow.show();
		}
	}],

	//resizable: false,
	initComponent: function() {
				
		this.msdlf = new MultisiteDownloadForm();
		
		var myMsdlf = this.msdlf;

		if (settingsData) {
			Ext.apply(myMsdlf, {
				url: settingsData.cacheBase
			});			
		} else {
			//if ( ! hidden) {
				//alert("No settings yet");				
			//}
		}
		
		Ext.apply(this, {
			closable: true,
			title: 'Identifying sites',
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
				id: 'typeGroup',
				items: [
					{
						boxLabel: 'Water Level',
						name: 'WATERLEVEL', id: 'dtype_wl',
						checked: true
					},          
					{
						boxLabel: 'Water Quality',
						name:'QUALITY', id: 'dtype_qw',
						checked: true
					},
					{
						boxLabel: 'Construction',
						name: 'CONSTRUCTION', id: 'dtype_const',
						checked: true
					},
					{
						boxLabel: 'Lithology',
						name:'LITHOLOGY', id : 'dtype_lith',
						checked: true
					}
				]
			},
					   
			'->',
			
			{
					text: 'Download data',
					handler: function() {
						
						// myMsdlf.items.clear();
						myMsdlf.clearItems();
						myMsdlf.addItem('type', 'REGISTRY');		// Always include the registry info
						var hasType = false;
						
						// start with list of types
						var cbl = Ext.getCmp('typeGroup');
						var ccbb = cbl.getValue();
						
						for (var i = 0; i < ccbb.length; i++) {
							var cb = ccbb[i];
							if (cb.getValue()) {
								myMsdlf.addItem('type', cb.getName());
								hasType = true;
							}
						}
						
						if ( ! hasType ) {
							Ext.MessageBox.alert("Which data would you like?","Please select at least one data type to download.");
						} else {
							var sites = DOWNLOAD_SITES.store.getRange();
							for (var j = 0; j < sites.length; j++) {
								var siteRecord = sites[j];
								
								var wellID = siteRecord.data.agency + ":" + siteRecord.data.siteNo;
								wellID = wellID.trim();
								// wellID = wellID.replace(/ /g, "+");
								wellID = wellID.replace(/ /g, "_");
								myMsdlf.addItem('featureID',wellID);
							}
							
							myMsdlf.formSubmitToTarget(null);
							
							// clear type selections
							// cbl.reset();
						}
						
						// TODO Close? Or use tracking window from SiteIdentifyWindow?
					}
			}]
		});
		
		
		DownloadPopup.superclass.initComponent.call(this);
	}
});

var dlPopup = new DownloadPopup();
dlPopup.hide();

function showDownload() {
	dlPopup.show();
}

function hideDownload() {
	dlPopup.hide();
}
