GWDP.ui.SitePreview = Ext.extend(Ext.Window, {
	title: 'Preview Sites',
	height: 500,
	width: 800,
	layout: 'fit',
	modal: true,
	closable: true,
	initComponent: function() {
		this.store = this.initialConfig.store;
		
		Ext.apply(this, {
			closable: true,
			title: 'Sites Preview',
			items: [
		        {
		        	xtype: 'grid',
		        	store: this.store,
		        	border: false,
		        	autoScroll: true,
		        	viewConfig: {forceFit: true},
		        	sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
		        	colModel: new Ext.grid.ColumnModel([
                            { header: "Site Name", width: 150, sortable: true, dataIndex: 'SITE_NAME'},
                            { header: "Site No.", width: 100, sortable: true, dataIndex: 'SITE_NO'} ,
                            { header: "Local Aquifer Name", width: 60, sortable: true, dataIndex: 'LOCAL_AQUIFER_NAME'},
                            { header: "Principal Aquifer", width: 150, sortable: true, dataIndex: 'NAT_AQFR_DESC'},
                            { header: "Agency", width: 60, sortable: true, dataIndex: 'AGENCY_CD'},
                            { header: "Agency Name", width: 60, sortable: true, dataIndex: 'AGENCY_NM'},
                            { header: "Lat", width: 60, sortable: true, dataIndex: 'DEC_LAT_VA'},
                            { header: "Lon", width: 60, sortable: true, dataIndex: 'DEC_LONG_VA'},
                            { header: "Well Depth", width: 60, sortable: true, dataIndex: 'WELL_DEPTH'},
	        	            {header: 'WL', dataIndex: 'WL_DATA_FLAG', width: 30},
	        	            {header: 'WQ', dataIndex: 'QW_DATA_FLAG', width: 30},
	        	            {header: 'Log', dataIndex: 'LOG_DATA_FLAG', width: 30}
                            ])
		        }
			]
		});
		
		
		GWDP.ui.DownloadPopup.superclass.initComponent.call(this);
	}
});


GWDP.ui.SiteSelector = 
  OpenLayers.Class(OpenLayers.Control, {

  // DOM Elements
  
    /**
     * Property: siteSelectorDiv
     * {DOMElement} 
     */
	  siteSelectorDiv: null,
    
    /** 
     * Property: minimizeDiv
     * {DOMElement} 
     */
    minimizeDiv: null,

    /** 
     * Property: maximizeDiv
     * {DOMElement} 
     */
    maximizeDiv: null,
    
    /**
     * 
     * Parameters:
     * options - {Object}
     */
    initialize: function(options) {
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
        var _this = this;
        this.store = options.store;
        this.emptyText = options.emptyText;
    },

    /**
     * APIMethod: destroy 
     */    
    destroy: function() {
        OpenLayers.Control.prototype.destroy.apply(this, arguments);
    },

    /** 
     * Method: setMap
     *
     * Properties:
     * map - {<OpenLayers.Map>} 
     */
    setMap: function(map) {
        OpenLayers.Control.prototype.setMap.apply(this, arguments);
    },

    /**
     * Method: draw
     *
     * Returns:
     * {DOMElement} A reference to the DIV DOMElement containing the 
     *     switcher tabs.
     */  
    draw: function() {
        OpenLayers.Control.prototype.draw.apply(this);

        // create layout divs
        this.loadContents();

        // set mode to minimize
        if(!this.outsideViewport) {
            this.minimizeControl();
        }
        return this.div;
    },
    
    /** 
     * Method: maximizeControl
     * Set up the labels and divs for the control
     * 
     * Parameters:
     * e - {Event} 
     */
    maximizeControl: function(e) {

        // set the div's width and height to empty values, so
        // the div dimensions can be controlled by CSS
        this.div.style.width = "";
        this.div.style.height = "";

        this.showControls(false);
        this.window.show();
        this.grid.syncSize();
        
        if (e != null) {
            OpenLayers.Event.stop(e);
        }
    },
    
    /** 
     * Method: minimizeControl
     * Hide all the contents of the control, shrink the size, 
     *     add the maximize icon
     *
     * Parameters:
     * e - {Event} 
     */
    minimizeControl: function(e) {

        // to minimize the control we set its div's width
        // and height to 0px, we cannot just set "display"
        // to "none" because it would hide the maximize
        // div
        this.div.style.width = "0px";
        this.div.style.height = "0px";

        this.showControls(true);
        this.window.hide();
        
        if (e != null) {
            OpenLayers.Event.stop(e);                                            
        }
    },

    /**
     * Method: showControls
     * Hide/Show all LayerSwitcher controls depending on whether we are
     *     minimized or not
     * 
     * Parameters:
     * minimize - {Boolean}
     */
    showControls: function(minimize) {
        this.maximizeDiv.style.display = minimize ? "" : "none";
        this.siteSelectorDiv.style.display = minimize ? "none" : "";
    },
    
    /** 
     * Method: loadContents
     * Set up the labels and divs for the control
     */
    loadContents: function() {
        var _this = this;
        
        this.downloadWindow = new GWDP.ui.DownloadPopup({store: this.store});

        // layers list div        
        this.siteSelectorDiv = document.createElement("div");
        this.siteSelectorDiv.id = this.id + "_siteSelectorDiv";
        this.siteCoundid = this.id + "_siteCountId";
        OpenLayers.Element.addClass(this.siteSelectorDiv, "siteSelectorDiv");
        
        
        var _blockEvent = function(e) { //stop clicks from reaching map
        	var e = e || window.event; //for ie
	        if (e != null) {
	            OpenLayers.Event.stop(e);
	        }
        };
        this.siteSelectorDiv.onclick = _blockEvent;
        this.siteSelectorDiv.ondblclick = _blockEvent;
        this.siteSelectorDiv.onmousedown = _blockEvent;
        
        this.div.appendChild(this.siteSelectorDiv);
        
        var _store = this.store;
        var _updateCount = function(s) {
        	document.getElementById(siteCountId).innerHTML = s.getCount() + " sites selected";
        };
        _store.on('datachanged', _updateCount);
        _store.on('add', _updateCount);
        _store.on('remove', _updateCount);
        
        var siteCountId = this.siteCoundid;
        this.window = new Ext.Panel({
        	title: "Site Selection",
        	resizable: false,
        	closable: false,
        	draggable: false,
        	width: 400,
        	height: 380,
        	renderTo: this.siteSelectorDiv,
        	buttonAlign: 'right',
        	layout: 'fit',
        	border: true,
        	tools: [{
        		id: 'minimize',
        		handler: function() {
        			_this.minimizeControl();
        		}
        	}],
        	buttons: [
        		{
        			text: "Remove Selected",
        			handler: function() { 
        				var selected = this.grid.getSelectionModel().getSelections();
        				for(var i = 0; i < selected.length; i++) {
        					this.store.remove(selected[i]);
        				}
        			},
        			scope: this
        		},{
        			text: "Preview",
        			handler: function() { 
        				(new GWDP.ui.SitePreview({store: this.store})).show();
        			},
        			scope: this
        		},
        		{
        			text: "Download",
        			handler: function() { 
        				this.downloadWindow.show();
        			},
            		scope: this
        		}
        	],
        	listeners: {
        		afterrender: function(w) {
        			console.log(this.emptyText);
        			this.grid = new Ext.grid.GridPanel({
		        		xtype: 'grid',
		        		store: _store,
		        		autoScroll: true,
		        		height: 350,
		            	viewConfig: {
		                    emptyText: this.emptyText,
		                    deferEmptyText: false
		                },
		        		sm: new Ext.grid.RowSelectionModel({singleSelect:false}),
		        	    colModel: new Ext.grid.ColumnModel({
		        	        defaults: {
		        	            sortable: true
		        	        },
		        	        columns: [
		        	            {id: 'SITE_NAME', header: 'Site Name', sortable: true, dataIndex: 'SITE_NAME', width: 205},
		        	            {header: 'Agency', sortable: true,  dataIndex: 'AGENCY_CD', width: 60},
		        	            {header: 'WL', dataIndex: 'WL_DATA_FLAG', width: 30},
		        	            {header: 'WQ', dataIndex: 'QW_DATA_FLAG', width: 30},
		        	            {header: 'Log', dataIndex: 'LOG_DATA_FLAG', width: 30}
		        	        ]
		        	    })
    				});
        			
        			w.add({
        				xtype: 'panel',
        				padding: 10,
        				border: false,
        				items: [
        				    this.grid,
	        				{
	        					html: "<div id='" + siteCountId + "'>0 sites selected</div>",
	        					border: false,
	        					padding: 5
	        				}]
        				}
        			);
        	        w.getEl().dom.onclick = _blockEvent;
        	        w.getEl().dom.ondblclick = _blockEvent;
        	        w.getEl().dom.onmousedown = _blockEvent;
        		},
        		scope: this
        	}
        });

        // maximize button div
        var img = OpenLayers.Util.getImageLocation('layer-switcher-maximize.png');
        this.maximizeDiv = OpenLayers.Util.createAlphaImageDiv(
                                    "OpenLayers_Control_MaximizeDiv", 
                                    null, 
                                    null, 
                                    img, 
                                    "absolute");
        this.maximizeDiv.onclick = function(){ _this.maximizeControl(); };
        
        OpenLayers.Element.addClass(this.maximizeDiv, "maximizeDiv olButton");
        this.maximizeDiv.style.display = "none";
        
        this.div.appendChild(this.maximizeDiv);
    },
    
    addSitesFromStore : function(inStore) {
    	inStore.each(function(r) {
    		if(this.store.findExact("SITE_NO", r.data.SITE_NO) < 0) {
    			this.store.add(r);
    		}
    	}, this);
    },
    
    CLASS_NAME: "GWDP.ui.SiteSelector"
});
