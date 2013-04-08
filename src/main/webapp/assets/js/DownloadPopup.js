GWDP.ui.MultisiteDownloadForm = Ext.extend(Ext.form.FormPanel,{
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

		this.url = GWDP.ui.cacheBaseUrl
        
		if(this.url && Ext.isEmpty(dom.action)){
            dom.action = this.url;
        }
        
        this.addItem('downloadToken', token);
        this.addItem('bundled','true');
        
		//pop up a new window that displays progress of download
        var downloadWindow = null;
		downloadWindow = new Ext.Window({
			height: 150,
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
				text: 'CANCEL',
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
//				log_it('funkychicken ' + cookieValue);
			}
		}, 1000);

        dom.submit();
        
        // must reset DOM form to clear out the appended input children
        this.clearItems();
	}
});

var fileTypeStore = new Ext.data.ArrayStore({
    fields: [
	            'type',
	            'displayText'
	        ],
	data: [['csv', 'CSV'], ['tsv', 'TSV']]
});

GWDP.ui.DownloadHelpPopup = Ext.extend(Ext.Window, {
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

GWDP.ui.DownloadPopup = Ext.extend(Ext.Window, {
	id: 'multisite-download-window',
	title: 'Multi-site Download',
	height: 300,
	width: 400,
	layout: 'fit',
	modal: true,
	closable: true,
	closeAction: 'hide',
	tools: [{
		id: 'help',
		qtip: 'Help on Download',
		handler: function() {
			(new GWDP.ui.DownloadHelpPopup()).show();
		}
	}],

	//resizable: false,
	initComponent: function() {
		this.store = this.initialConfig.store;
		
		this.msdlf = new GWDP.ui.MultisiteDownloadForm();
		
		var myMsdlf = this.msdlf;

		Ext.apply(myMsdlf, {
			url: GWDP.ui.cacheBaseUrl
		});			
		
		
		this.beginDate = new Ext.form.DateField({format: 'Y-m-d'});
		this.endDate = new Ext.form.DateField({format: 'Y-m-d'});
		this.fileType = new Ext.form.ComboBox({
			fieldLabel: 'Select file type',
		    mode: 'local',
		    name: 'fileType',
		    store: fileTypeStore,
		    // minChars: 999,
		    // typeAhead: true,
		    // autoSelect: true,
		    editable: false,
		    triggerAction: 'all',
		    value: 'csv',
		    selectOnFocus:true,
		    // listEmptytext: 'File Format',
		    valueField: 'type',
		    displayField: 'displayText'
		});
		
		Ext.apply(this, {
			closable: true,
			title: 'Download Data',
			layout: 'form',
			labelWidth: 150,
			listeners: {
				show: function(w) {
					document.getElementById('multisite-download-window-count').innerHTML = this.store.getCount() + " sites selected.";
				}
			},
			items: [{
						html: "<div id='multisite-download-window-count' class='ngwmn-site-count-label'>" + this.store.getCount() + " sites selected.</div>"
					},{
						html: "<div class='download-opts-label'>DOWNLOAD OPTIONS:</div>",
						border: false
					},{
						xtype: 'container',
						fieldLabel: 'Select date range',
						padding: 0,
						border: false,
						layout: 'hbox',
						items: [this.beginDate,{
							html: "&nbsp;to&nbsp",
							border: false
						},this.endDate]
					},this.fileType,{
						xtype: 'checkboxgroup',
						// layout: 'fit',
						fieldLabel: 'Select data types',
						id: 'typeGroup',
						vertical: true,
						columns: 1,
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
			        myMsdlf
			        ],
			buttonAlign: 'right', 
			buttons: [
			{
					text: 'DOWNLOAD',
					handler: function() {
						if (!this.fileType.getValue()) {
							Ext.MessageBox.alert("", "You must select a file type.");
							return;
						}
						
						// myMsdlf.items.clear();
						myMsdlf.clearItems();
						myMsdlf.addItem('type', 'REGISTRY');		// Always include the registry info
						
						if(this.beginDate.getRawValue()) myMsdlf.addItem("beginDate", this.beginDate.getRawValue());
						if(this.endDate.getRawValue()) myMsdlf.addItem("endDate", this.endDate.getRawValue());
						myMsdlf.addItem("fileType", this.fileType.getValue());
						
						// start with list of types
						var cbl = Ext.getCmp('typeGroup');
						var ccbb = cbl.getValue();
						
						//list of sites
						var sites = this.store.getRange();
						
						var numberOfTypesSelected = 0;
						for (var i = 0; i < ccbb.length; i++) {
							var cb = ccbb[i];
							if (cb.getValue()) {
								myMsdlf.addItem('type', cb.getName());
								numberOfTypesSelected++;
								GoogleAnalyticsUtils.logDownloadSiteSetByType(cb.getName(), sites.length);
							}
						}
						
						if ( numberOfTypesSelected <= 0 ) {
							Ext.MessageBox.alert("Which data would you like?","Please select at least one data type to download.");
						} else {
							GoogleAnalyticsUtils.logDownloadSiteSetTotal(numberOfTypesSelected); //log total times download button was clicked
							
							var countByAgencyObject = {}; //object used to get more analytics about how much agency data is collected
							
							for (var j = 0; j < sites.length; j++) {
								var siteRecord = sites[j];
								
								var wellID = siteRecord.data.AGENCY_CD + ":" + siteRecord.data.SITE_NO;
								wellID = wellID.trim();
								// wellID = wellID.replace(/ /g, "+");
								wellID = wellID.replace(/ /g, "_");
								myMsdlf.addItem('featureID',wellID);
								
								//analytics aggregation
								if(!countByAgencyObject[siteRecord.data.agency]) {
									countByAgencyObject[siteRecord.data.agency] = 1; //initialize count to 1 for first time seen
								} else {
									countByAgencyObject[siteRecord.data.agency]++; //increment count
								}
							}
							
							for(var agency in countByAgencyObject) {
								GoogleAnalyticsUtils.logDownloadSiteSetByAgency(agency, countByAgencyObject[agency]); //number of sites for each agency in this download
							}
							
							myMsdlf.formSubmitToTarget(null);
							
							// clear type selections
							// cbl.reset();
						}
						
						this.hide();
					},
					scope: this
			}]
		});
		
		
		GWDP.ui.DownloadPopup.superclass.initComponent.call(this);
	}
});
