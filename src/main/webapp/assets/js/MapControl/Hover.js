GWDP.ui.HoverControl = OpenLayers.Class(OpenLayers.Control, {            
    initialize: function(options) {
        OpenLayers.Control.prototype.initialize.apply(
            this, arguments
        );
        
        this.map = options.map;
        this.pauseHandler = options.pauseHandler;
        
        this.handler = new OpenLayers.Handler.Hover(
            this, {
                'pause': this.pauseHandler
            }, {
                'single': true
            }
        );
    },
    
    CLASS_NAME: "GWDP.ui.HoverControl"
});