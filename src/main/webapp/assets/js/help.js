GWDP.ui.help.initHelpTips = function(){
	GWDP.ui.help.showWelcome();
	
    var wlFlag = new GWDP.ui.GwdpHelpTip({        
        title: 'Water level',
        target: 'WL_SN_FLAG',
        anchor: 'right',
        width: 415,
        autoHide: false,
        closable: true,
        contentEl: 'ngwmn-water-level-tip'
    });
    
    var wlSub = new GWDP.ui.GwdpHelpTip({        
        title: 'Water level - Subnetwork', 
        target: 'WL_WELL_CHARS',
        anchor: 'right',
        width: 415,
        autoHide: false,
        closable: true,
        contentEl: 'ngwmn-water-level-subnetwork-tip'
    });
    
    var wlMon = new GWDP.ui.GwdpHelpTip({        
        title: 'Water level - Monitoring Category',
        target: 'WL_WELL_TYPE',
        anchor: 'right',
        width: 415,
        autoHide: false,
        closable: true,
        contentEl: 'ngwmn-water-level-category-tip'
    });
    
    var qwFlag = new GWDP.ui.GwdpHelpTip({        
        title: 'Water quality',
        target: 'QW_SN_FLAG',
        anchor: 'right',
        width: 415,
        autoHide: false,
        closable: true,
        contentEl: 'ngwmn-water-quality-tip'
    });
    
    var qwSub = new GWDP.ui.GwdpHelpTip({        
        title: 'Water quality - Subnetwork', 
        target: 'QW_WELL_CHARS',
        anchor: 'right',
        width: 415,
        autoHide: false,
        closable: true,
        contentEl: 'ngwmn-water-quality-subnetwork-tip'
    });
    
    var qwMon = new GWDP.ui.GwdpHelpTip({        
        title: 'Water quality - Monitoring Category',
        target: 'QW_WELL_TYPE',
        anchor: 'right',
        width: 415,
        autoHide: false,
        closable: true,
        contentEl: 'ngwmn-water-quality-category-tip'
    });
    
    var aquifer = new GWDP.ui.GwdpHelpTip({        
        title: 'Principal Aquifer', 
        target: 'principalAquifer',
        anchor: 'right',
        width: 415,
        autoHide: false,
        closable: true,
        contentEl: 'ngwmn-aquifer-tip'
    });
    
    var agency = new GWDP.ui.GwdpHelpTip({        
        title: 'Contributing Agency',
        target: 'contributingAgencies',
        anchor: 'right',
        width: 415,
        autoHide: false,
        closable: true,
        contentEl: 'ngwmn-agency-tip'
    });
    
    
    var availableDataTip = new GWDP.ui.GwdpHelpTip({        
        title: 'Available Data',
        target: 'availableDataTipAnchor',
        anchor: 'right',
        width: 415,
        autoHide: false,
        closable: true,
        contentEl: 'ngwmn-available-data-tip'
    });    
    
    var stateAndCountyTip = new GWDP.ui.GwdpHelpTip({        
        title: 'State & County',
        target: 'state-and-county-selector',
        anchor: 'right',
        width: 415,
        autoHide: false,
        closable: true,
        contentEl: 'ngwmn-state-and-county-tip'
    }); 
    
    Ext.getCmp('gwdpFilters').on('afterlayout', function(){
    	wlFlag.hide();
    	wlSub.hide();
    	wlMon.hide();
    	qwFlag.hide();
    	qwSub.hide();
    	qwMon.hide();
    	aquifer.hide();
    	agency.hide();
        availableDataTip.hide();
        stateAndCountyTip.hide();
    });
};

GWDP.ui.help.showWelcome = function() {
	Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
	if(Ext.state.Manager.get(GWDP.ui.SKIP_TIPS_COOKIENAME, "false")!="true") {
		var tips = Ext.create({
			// title: 'Welcome to the NGWMN Data Portal!',
			xtype: 'window',
			modal: true,
			contentEl: 'ngwmn-description',
			padding: 20,
			bbar: [{
				xtype: 'checkbox',
				boxLabel: "Don't show me this again",
				listeners:{
					check: function(cb, checked) {
						if(checked) {
							Ext.state.Manager.set(GWDP.ui.SKIP_TIPS_COOKIENAME, "true");
						} else {
							Ext.state.Manager.clear(GWDP.ui.SKIP_TIPS_COOKIENAME);
						}
					}
				}
			}],
			width: 600,
			height: 400
		});
		tips.show();
	}
};

/**
 * This is a very hackish override and seems to only work with panels and form layours used in ui.js
 */
GWDP.ui.GwdpHelpTip = Ext.extend(Ext.ToolTip,{
	initTarget : function(target){ 
		var t; 
		if((t = Ext.get(target))){ 
			//create a new sibling of the target and make that the new target
			var div = document.createElement("div");
			div.className = "x-tool x-tool-help ngwmn-tooltip";
			div.style.position = "absolute";
			div.style.top = "2px";
			var width = Ext.getCmp(target).width || t.dom.offsetWidth;
			div.style.marginLeft = (width + 5) + "px"; 
			this.target = div.id = target+"_tooltip";
			t.dom.parentNode.appendChild(div);
			var helpEl = new Ext.Element(div);
			
			if(this.target){
				var tg = Ext.get(this.target);
				this.mun(tg, 'click', this.onTargetOver, this);
				this.mun(tg, 'mouseout', this.onTargetOut, this);
				this.mun(tg, 'mousemove', this.onMouseMove, this);
			}
			this.mon(helpEl, {
				click: this.onTargetOver,
				mouseout: this.onTargetOut,
				mousemove: this.onMouseMove,
				scope: this
			});
			this.target = helpEl;
		}
		if(this.anchor){
			this.anchorTarget = this.target;
		}
	}
});
Ext.reg('gwdpHelpTip', GWDP.ui.GwdpHelpTip);

