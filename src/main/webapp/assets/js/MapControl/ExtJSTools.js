

GWDP.ui.ExtJSTools = 
  OpenLayers.Class(OpenLayers.Control, {
    /**
     * 
     * Parameters:
     * options - {Object}
     */
    initialize: function(options) {
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
        var _this = this;
        this.tools = options.tools;
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
        this.extTools = [];
        this.div.tools = {};
        
        var _blockEvent = function(e) { //stop clicks from reaching map
        	var e = e || window.event; //for ie
	        if (e != null) {
	            OpenLayers.Event.stop(e);
	        }
        };
        this.div.onclick = _blockEvent;
        this.div.ondblclick = _blockEvent;
        this.div.onmousedown = _blockEvent;
        
        var nonHiddenCount = 0;
        for(var i = this.tools.length - 1; i >= 0; i--) {
        	var toolC = this.tools[i];
        	// layers list div        
            var div = document.createElement("div");
            div.id = this.id + "_tool" + i;'<div class="x-tool x-tool-{id}">&#160;</div>'
            OpenLayers.Element.addClass(div, "ol-ux-tool");
            OpenLayers.Element.addClass(div, "x-tool");
            OpenLayers.Element.addClass(div, "x-tool-" + toolC.id);
            
            var t = new Ext.Element(div);
            this.extTools.push(t);
            this.div.appendChild(div);
            t.enableDisplayMode('block');
            t.on('click',  toolC.handler);
            t.addClassOnOver('x-tool-'+div.id+'-over');
            this.div.tools[toolC.id] = t;
            
            if(toolC.hidden) {
            	t.hide();
            } else {
            	nonHiddenCount++;
            }
        };

        this.div.style.cssText = "padding: 3px; height: 16px; width: " + (17 * nonHiddenCount) + "px;";
        
        return this.div;
    },
    
    CLASS_NAME: "GWDP.ui.ExtJSTools"
});
