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
					// force redisplay to make sure sites are shown?
					// win.unmask();
					win.doLayout(false, true);
				} else {
					alert('no download window to enable');
				}
			}
		});
	}

};

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
		
		var dom = form.el.dom;
		var elems = dom.elements;
		for (var i = 0; i < elems.length; i++) {
			dom.removeChild(elems[i]);
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
	html: '<h1>Download Help</h1>'+
		'<p>Data for one or more sites may be downloaded for analysis.</p> '+
		'<p>The data download is available from the "Site Identification" '+
		'tool, for download of data from one site, or from the "Multi-Site '+
		'Download Tool", for data from multiple sites.</p> '+

		'<h2>Single-Site Download</h2>'+
		'<p>At present, data for a single site is available as an XLS '+
		'(Microsoft &reg; Excel &reg; format) file, with three sheets: '+ 
		'<ul><li>Well Log<li>Water Levels<li>Water Quality</ul>'+
		'</p>'+

		'<p>The Well Log sheet contains both Lithology and Construction	information.</p>'+

		'<p>The format for the single-site download will soon change to be identical to that for the Multi-Site Download (q.v.).</p>'+

		'<h2>Multi-Site Download</h2>'+

		'<p>The multi-site download tool provides data for all the sites visible on the map, which can be controlled using the agency, '+
		'aquifer, and network selection filters (in the left sidebar of the	map) and the drag and zoom tools.</p>' +

		'<p>The download tool allows you to choose which data categories to download for the visible sites, choosing from: '+
		'<ul><li>Water Level<li>Water Quality<li>Construction<li>Lithology</li></ul></p>'+

		'<p>The data is downloaded as a zip file, containing one CSV (comma-separated values) file for each selected data category;'+
		'the columns in each CSV file are labeled with column headers. The columns are separated by the comma character (ASCII 44), data is delimited by '+
		'the quote character (ASCII 34), and each row of data is terminated by a linefeed character (ASCII 10).</p>'
});
var dlHelpWindow = new DownloadHelpPopup();

var DownloadPopup = Ext.extend(Ext.Window, {
	id: 'multisite-download-window',
	title: 'Multi-site Download',
	height: 200,
	width: 650,
	layout: 'fit',
	modal: true,
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
			alert("No settings yet");
		}
		
		Ext.apply(this, {
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
						
						myMsdlf.items.clear();
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
							alert("No data type chosen. Fail.");
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
