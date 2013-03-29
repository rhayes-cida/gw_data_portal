GWDP.ui.OverviewMap = 
	OpenLayers.Class(OpenLayers.Control.OverviewMap, {
		draw: function() {
			OpenLayers.Control.prototype.draw.apply(this, arguments);
			if (this.layers.length === 0) {
				if (this.map.baseLayer) {
					var layer = this.map.baseLayer.clone();
					this.layers = [layer];
				} else {
					this.map.events.register("changebaselayer", this, this.baseLayerDraw);
					return this.div;
				}
			}

			// create overview map DOM elements
			this.element = document.createElement('div');
			this.element.className = this.displayClass + 'Element';
			this.element.style.display = 'none';

			this.mapDiv = document.createElement('div');
			this.mapDiv.style.width = this.size.w + 'px';
			this.mapDiv.style.height = this.size.h + 'px';
			this.mapDiv.style.position = 'relative';
			this.mapDiv.style.overflow = 'hidden';
			this.mapDiv.id = OpenLayers.Util.createUniqueID('overviewMap');

			this.extentRectangle = document.createElement('div');
			this.extentRectangle.style.position = 'absolute';
			this.extentRectangle.style.zIndex = 1000;  //HACK
			this.extentRectangle.className = this.displayClass+'ExtentRectangle';

			this.element.appendChild(this.mapDiv);  

			this.div.appendChild(this.element);

			// Optionally add min/max buttons if the control will go in the
			// map viewport.
			if(!this.outsideViewport) {
				this.div.className += " " + this.displayClass + 'Container';
				// maximize button div
				var img = 'assets/ngwmn_ext_skin/images/map/extent_navigator.gif'; //TODO change to CSS
				this.maximizeDiv = OpenLayers.Util.createAlphaImageDiv(
						this.displayClass + 'MaximizeButton', 
						null, 
						null, 
						img, 
						'absolute');
				this.maximizeDiv.style.display = 'none';
				this.maximizeDiv.className = this.displayClass + 'MaximizeButton olButton';
				this.div.appendChild(this.maximizeDiv);

				// minimize button div
				var img = OpenLayers.Util.getImageLocation('layer-switcher-minimize.png');
				this.minimizeDiv = OpenLayers.Util.createAlphaImageDiv(
						'OpenLayers_Control_minimizeDiv', 
						null, 
						null, 
						img, 
						'absolute');
				this.minimizeDiv.style.display = 'none';
				this.minimizeDiv.className = this.displayClass + 'MinimizeButton olButton';
				this.div.appendChild(this.minimizeDiv);            
				this.minimizeControl();
			} else {
				// show the overview map
				this.element.style.display = '';
			}
			if(this.map.getExtent()) {
				this.update();
			}

			this.map.events.on({
				buttonclick: this.onButtonClick,
				moveend: this.update,
				scope: this
			});

			if (this.maximized) {
				this.maximizeControl();
			}
			return this.div;
		},
		
		CLASS_NAME: 'GWDP.ui.OverviewMap'
	});