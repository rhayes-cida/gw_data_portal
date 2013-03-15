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
	
	CLASS_NAME: "GWDP.ui.PanZoom"
});

