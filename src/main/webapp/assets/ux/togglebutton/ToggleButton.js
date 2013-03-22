GWDP.ui.ToggleButton = Ext.extend(Ext.form.Checkbox,  {
    boxLabel: '&#160;',
    
    defaultAutoCreate : { tag: 'div', class: 'ux-toggle-button', style: 'width: 80px; height: 55px'},
	
    initComponent : function(){
        Ext.form.Checkbox.superclass.initComponent.call(this);
        
        if(this.initialConfig.imgClass) {
        	this.imgClass = this.initialConfig.imgClass;
        }
        
        this.addEvents(
            'check'
        );
    },
    
    initEvents : function(){
    	Ext.form.Checkbox.superclass.initEvents.call(this);
    },

    onRender : function(ct, position){
        Ext.form.Checkbox.superclass.onRender.call(this, ct, position);
        
        if(this.imgClass) {
        	this.el.dom.className = this.el.dom.className + " ux-toggle-button-" + this.imgClass;
        }
        
        if(this.inputValue !== undefined){
            this.el.dom.value = this.inputValue;
        }
        this.wrap = this.el.wrap({cls: 'x-toggle-button-wrap'});
        if(this.boxLabel){
            this.wrap.createChild({tag: 'label', htmlFor: this.el.id, cls: 'x-toggle-button-label', html: this.boxLabel});
        }
        if(this.checked){
            this.setValue(true);
        }
        
        if (Ext.isIE && !Ext.isStrict) {
            this.wrap.repaint();
        }
        this.resizeEl = this.positionEl = this.wrap;
        
        //attach onclick event to image div
        var _this = this;
        this.el.dom.onclick = function() {
        	_this.onClick();
        };
        
        this.input = this.wrap.createChild({tag: 'input', type: 'hidden', name: this.name});
    },

	
    onClick : function(){
        //change class
        this.el.dom.className = this.el.dom.className.replace(/ux-toggle-button-checked/g, "ux-toggle-button ");
        if(!this.checked) {
            this.el.dom.className = this.el.dom.className.replace(/ux-toggle-button /g, "ux-toggle-button-checked ");
        }
        this.input.dom.value = !this.checked ? 'on' : 'off';
        this.setValue(!this.checked);
    },
});
Ext.reg('togglebutton', GWDP.ui.ToggleButton);