GWDP.ui.ClickControl = OpenLayers.Class(OpenLayers.Control, {            
    initialize: function(options) {
        OpenLayers.Control.prototype.initialize.apply(
            this, arguments
        );
        
        this.map = options.map;
        this.clickHandler = options.clickHandler;
        
        this.handler = new OpenLayers.Handler.Click(
            this, {
                'click': this.clickHandler
            }, {
                'single': true
            }
        );
    },
    
    CLASS_NAME: "GWDP.ui.HoverControl"
});