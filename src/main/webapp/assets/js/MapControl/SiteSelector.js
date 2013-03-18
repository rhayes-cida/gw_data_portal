
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
        	tools: [{
        		id: 'minimize',
        		handler: function() {
        			_this.minimizeControl();
        		}
        	}],
        	buttons: [
        		{
        			text: "Preview",
        			handler: function() { alert('TODO: Show detailed site info grid'); }
        		},
        		{
        			text: "Download",
        			handler: function() { alert('TODO: Start multisite download'); }
        		}
        	],
        	listeners: {
        		afterrender: function(w) {
        			w.add({
        				xtype: 'panel',
        				padding: 10,
        				border: false,
        				items: [{
				        		xtype: 'grid',
				        		height: 350,
				        		store: _store,
				        	    colModel: new Ext.grid.ColumnModel({
				        	        defaults: {
				        	            sortable: true
				        	        },
				        	        columns: [
				        	            {id: 'SITE_NAME', header: 'Site Name', sortable: true, dataIndex: 'SITE_NAME', width: 205},
				        	            {header: 'Agency', sortable: true,  dataIndex: 'AGENCY_CD', width: 60},
				        	            {header: 'WL', dataIndex: 'WL_DATA_FLAG', width: 30},
				        	            {header: 'WQ', dataIndex: 'QW_DATA_FLAG', width: 30},
				        	            {header: 'Lith', dataIndex: 'LOG_DATA_FLAG', width: 30}
				        	        ]
				        	    })
	        				},
	        				{
	        					html: "<div id='" + siteCountId + "'>0 sites selected</div>",
	        					border: false,
	        					padding: 5,
	        					handler: function() { alert('TODO: Show detailed site info grid'); }
	        				}]
        				}
        			);
        	        w.getEl().dom.onclick = _blockEvent;
        	        w.getEl().dom.onmousedown = _blockEvent;
        		}
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
