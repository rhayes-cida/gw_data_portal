BaseLayersWindow = Ext.extend(Ext.Window, {
	title: 'Base Map Layers',
	width: 600,
	height: 400,
	modal: true,
	layout: 'border',
	closeAction: 'hide',
	resizable: false,
	
	initComponent: function() {
		Ext.apply(this, {
			items: [{
				region: 'center',
				autoScroll: true,
				bodyStyle: 'padding: 5px',
				items: [
				    this.createBaseLayerEntry(29320),
				    this.createBaseLayerEntry(29322),
				    this.createBaseLayerEntry(29327),
				    this.createBaseLayerEntry(23413)
				]
			}],
			buttons: [{
				text: 'Close',
				handler: function() {
					this.hide();
				},
				scope: this
			}]
		});
		BaseLayersWindow.superclass.initComponent.call(this, arguments);
	},
	
	createBaseLayerEntry: function(layerId) {
		
		var l = map1.layerManager.getMapLayer(layerId);
		
		if (!l.isHiddenFromUser && map1.layerManager.isLayerAvailable(l)) {

			var layerHTML = '';
			layerHTML += '<div class="clearfix">';
			layerHTML += '<img style="float:left; border: dotted gray 1px; width: 150px;" src="' + l.legendUrl + '" alt="legend" />';
			layerHTML += '<div style="float:left; padding-left: 5px; width: 345px;">';
			layerHTML += '</div>';
			
			var descHTML = '<h2>' + l.title + '</h2>';
			descHTML += '<p>Description: ' + l.description + '</p>';
			descHTML += '</div>';
			
			
		    var tip = new Ext.ux.SliderTip({
		        getText: function(slider){
		            return String.format('<b>{0}%</b>', slider.getValue());
		        }
		    });
			
			
			//create a panel for this layer
			var p = new Ext.Panel({
				style: 'padding-bottom: 5px',
				bodyStyle: 'padding: 3px;',
				layout: 'column',
				layoutConfig: {columns: 2},
				items: [{
					width: 160,
					xtype: 'form',
					labelWidth: 50,
					border: false,
					items: [{
						xtype: 'panel',
						bodyStyle: 'padding: 3px',
						html: layerHTML,
						border: false
					},{
						xtype: 'checkbox',
						fieldLabel: 'On/Off',
						checked: !!(map1.layerManager.getActiveLayer(l.id)),
						hidden: l.isHiddenFromUser,
						hideLabel: l.isHiddenFromUser,
						layerId: l.id,
						listeners: {
							check: function(c,b) {
								if (b) {
									map1.appendLayer(c.layerId);									
								} else {
									map1.removeLayer(c.layerId);
								}
							}
						}
					},{
						xtype: 'slider',
						fieldLabel: 'Opacity (-/+)',
						layerId: l.id,
					    width: 100,
					    value: l.opacity,
					    increment: 1,
					    minValue: 0,
					    maxValue: 100,
					    plugins: tip,
					    listeners: {
							change: function(s, v) {
								map1.layerManager.getMapLayer(s.layerId).setOpacity(v);
							}
						}
					}]
				},{
					html: descHTML,
					width: 350,
					border: false
				}]
			});
			
			return p;
		}
		
		return null;
	}
});
