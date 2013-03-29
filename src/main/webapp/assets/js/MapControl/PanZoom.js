GWDP.ui.PanZoomControl = OpenLayers.Class(OpenLayers.Control.PanZoom, {
	
	initialize: function(options) {
		this.zoomButtonHandler = options.zoomButtonHandler;
		OpenLayers.Control.PanZoom.prototype.initialize.apply(this, arguments);
	},
	
	onButtonClick: function(evt) {
		var btn = evt.buttonElement;
		switch (btn.action) {
		case "panup":
			this.map.pan(0, -this.getSlideFactor("h"));
			break;
		case "pandown":
			this.map.pan(0, this.getSlideFactor("h"));
			break;
		case "panleft":
			this.map.pan(-this.getSlideFactor("w"), 0);
			break;
		case "panright":
			this.map.pan(this.getSlideFactor("w"), 0);
			break;
		case "zoomin":
			this.map.zoomIn();
			break;
		case "zoomout":
			this.map.zoomOut();
			break;
		case "zoomworld":
			this.zoomButtonHandler();
			break;
		}
	},
	
    draw: function(px) {
        // initialize our internal div
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        px = this.position;

        // place the controls
        this.buttons = [];

        var sz = {w: 18, h: 18};
        var centered = new OpenLayers.Pixel(px.x+sz.w/2, px.y);

        this._addButton("panup", "assets/ngwmn_ext_skin/images/map/north.gif", centered, sz);
        px.y = centered.y+sz.h;
        this._addButton("panleft", "assets/ngwmn_ext_skin/images/map/west.gif", px, sz);
        this._addButton("panright", "assets/ngwmn_ext_skin/images/map/east.gif", px.add(sz.w, 0), sz);
        this._addButton("pandown", "assets/ngwmn_ext_skin/images/map/south.gif", 
                        centered.add(0, sz.h*2), sz);
        this._addButton("zoomin", "assets/ngwmn_ext_skin/images/map/zoom_in.gif", 
                        centered.add(0, sz.h*3+5), sz);
        this._addButton("zoomworld", "assets/ngwmn_ext_skin/images/map/full_extent.gif", 
                        centered.add(0, sz.h*4+5), sz);
        this._addButton("zoomout", "assets/ngwmn_ext_skin/images/map/zoom_out.gif", 
                        centered.add(0, sz.h*5+5), sz);
        return this.div;
    },
    
    _addButton:function(id, img, xy, sz) {
        var btn = OpenLayers.Util.createAlphaImageDiv(
                                    this.id + "_" + id, 
                                    xy, sz, img, "absolute");
        btn.style.cursor = "pointer";
        //we want to add the outer div
        this.div.appendChild(btn);
        btn.action = id;
        btn.className = "olButton";
    
        //we want to remember/reference the outer div
        this.buttons.push(btn);
        return btn;
    },
	
	CLASS_NAME: "GWDP.ui.PanZoom"
		
		
});

