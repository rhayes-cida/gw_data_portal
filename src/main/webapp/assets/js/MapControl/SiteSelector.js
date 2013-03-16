
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
        this.minimizeDiv.style.display = minimize ? "none" : "";
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
        OpenLayers.Element.addClass(this.siteSelectorDiv, "siteSelectorDiv");
        
        this.div.appendChild(this.siteSelectorDiv);
        
        this.window = new Ext.Window({
        	title: "Site Selection",
        	resizable: false,
        	closable: false,
        	draggable: false,
        	width: 400,
        	height: 380,
        	renderTo: this.siteSelectorDiv,
        	tools: [{
        		id: 'minimize',
        		handler: function() {
        			_this.minimizeControl();
        		}
        	}]
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

        // minimize button div
        var img = OpenLayers.Util.getImageLocation('layer-switcher-minimize.png');
        this.minimizeDiv = OpenLayers.Util.createAlphaImageDiv(
                                    "OpenLayers_Control_MinimizeDiv", 
                                    null, 
                                    null, 
                                    img, 
                                    "absolute");
        this.minimizeDiv.onclick = function(){ _this.minimizeControl(); };
        
        OpenLayers.Element.addClass(this.minimizeDiv, "minimizeDiv olButton");
        this.minimizeDiv.style.display = "none";

        this.div.appendChild(this.minimizeDiv);
        
        console.log(this.div);
    },
    
    CLASS_NAME: "GWDP.ui.SiteSelector"
});
