GWDP.ui.ZoomBoxControl = OpenLayers.Class(OpenLayers.Control.ZoomBox, {            
    initialize: function(options) {
        OpenLayers.Control.prototype.initialize.apply(
            this, arguments
        );
        
        this.map = options.map;
        this.boxHandler = options.boxHandler;
        this.pixelHandler = options.pixelHandler;
        
        if(!this.boxHandler) {
        	this.boxHandler = function(){
        		 // always zoom in/out 
                var lastZoom = this.map.getZoom(); 
                this.map.zoomToExtent(bounds);
                if (lastZoom == this.map.getZoom() && this.alwaysZoom == true){ 
                    this.map.zoomTo(lastZoom + (this.out ? -1 : 1)); 
                }
        	};
       }
    },
    
    zoomBox: function (position) {
        if (position instanceof OpenLayers.Bounds) {
            var bounds;
            if (!this.out) {
                var minXY = this.map.getLonLatFromPixel({
                    x: position.left,
                    y: position.bottom
                });
                var maxXY = this.map.getLonLatFromPixel({
                    x: position.right,
                    y: position.top
                });
                bounds = new OpenLayers.Bounds(minXY.lon, minXY.lat,
                                               maxXY.lon, maxXY.lat);
            } else {
                var pixWidth = Math.abs(position.right-position.left);
                var pixHeight = Math.abs(position.top-position.bottom);
                var zoomFactor = Math.min((this.map.size.h / pixHeight),
                    (this.map.size.w / pixWidth));
                var extent = this.map.getExtent();
                var center = this.map.getLonLatFromPixel(
                    position.getCenterPixel());
                var xmin = center.lon - (extent.getWidth()/2)*zoomFactor;
                var xmax = center.lon + (extent.getWidth()/2)*zoomFactor;
                var ymin = center.lat - (extent.getHeight()/2)*zoomFactor;
                var ymax = center.lat + (extent.getHeight()/2)*zoomFactor;
                bounds = new OpenLayers.Bounds(xmin, ymin, xmax, ymax);
            }
           
            this.boxHandler(bounds);
        } else { // it's a pixel
            //do nothing
        }
    },
    
    CLASS_NAME: "GWDP.ui.HoverControl"
});