if ( Dygraph && Dygraph.dateParser) {
	// Hack to override Dygraph time parsing to explicitly handle ISO8601 dates 
	// when browser's native date parsing can't handle it. This is a known 
	// problem for IE8, and possibly Safari webkit as well
	
	// References:
	//		http://msdn.microsoft.com/en-us/library/ff743760%28v=vs.94%29.aspx
	//		http://stackoverflow.com/questions/8266710/javascript-date-parse-difference-in-chrome-and-other-browsers
	
	Dygraph.ISO8601TimeZoneRegex = /Z|z|[+-]\d\d:?\d\d$/;
	
	Dygraph.dateParser = function(dateStr){
		var d = null;
		// Switching default behavior to using locale instead of GMT if no timezone specified
		if (Dygraph.ISO8601TimeZoneRegex.test(dateStr)){ // has time zone
			// If the native date parsing is able to handle it, then return the result quickly
			d = Dygraph.dateStrToMillis(dateStr);
			if (!d || isNaN(d)){
				d = Dygraph.parseISO8601Date(dateStr, true);
			}
		} else {// no time zone included.
			// In this case, can't use native parsing first because it defaults to GMT.
			// Try to parse as ISO8601 date first.
			d = Dygraph.parseISO8601Date(dateStr, true);
			if (!d || isNaN(d)){ // then try native
				d = Dygraph.dateStrToMillis(dateStr);
			}
		}	

		if (!d || isNaN(d)) {
			Dygraph.error("Couldn't parse " + dateStr + " as a date");
		}
		return d;
	};
	
	Dygraph.ISO8601DateTimeRegex = /^(\d{4})-?(\d\d)-?(\d\d)(T(\d\d)(:?(\d\d):?(\d\d)?)?)?/;
	
	Dygraph.parseISO8601Date = function(dateStr, asLocal){
		// var ISO8601DateRegex = /^(\d{4})-?(\d\d)-?(\d\d)/;
		/*	Parsing ISO8601 time, according to http://en.wikipedia.org/wiki/ISO_8601#Times
		 * 	Supporting hh:mm:ss, hhmmss, hh:mm, hhmm, hh
		 */
		// var ISO8601TimeRegex = /T(\d\d)(:?(\d\d):?(\d\d)?)?/;
		/* Parsing ISO8601 time zones, according to http://en.wikipedia.org/wiki/ISO_8601#Time_zone_designators
		 * Supporting <time>Z and <time><offset>
		 */
		
		// combined Date Time parsing, ignoring time zone because Date.UTC() can't deal with it
		var m = Dygraph.ISO8601DateTimeRegex.exec(dateStr);

		if (asLocal){
			return (new Date(m[1], (m[2] || 1) - 1, m[3] || "1", m[5]||"00", m[7]||"00", m[8]||"00")).getTime();
		} else {
			return Date.UTC(m[1], (m[2] || 1) - 1, m[3] || "1", m[5]||"00", m[7]||"00", m[8]||"00").getTime();
		}
	};
	
	Dygraph.prototype.loadedEvent_ = function(data) {
		  this.rawData_ = this.parseCSV_(data);
		  if (this.rawData_.length == 1){
			  this.showError("No graph displayed for a single data point");
			  return;
		  }

		  this.predraw_();
		  var reverseValues = true;
		  var hasOptions = false;
		  var callBack = WATER_LEVEL_TAB.unmask;
		  var options = {};

		  if (reverseValues){
			  var yRange = this.yAxisRange(0);
			  options.valueRange = [yRange[1], yRange[0]];
			  hasOptions = true;
		  }
		  if (hasOptions){
			  this.updateOptions(options);
		  }
		  if (callBack){
			  callBack();
		  }
	};
	
	Dygraph.prototype.showError = function(msg){
		  var div = this.maindiv_;
		  var exc = null;
		  try{
			  this.destroy();
		  } catch(exc){
			  Dygraph.error("Couldn't parse destroy dygraph due to " + exc );
		  }
		  
		  div.innerHTML = msg;
		  return;
	};
	

	DygraphCanvasRenderer.prototype._renderAxis = function() {
	  if (!this.attr_('drawXAxis') && !this.attr_('drawYAxis')) return;

	  // Round pixels to half-integer boundaries for crisper drawing.
	  function halfUp(x)  { return Math.round(x) + 0.5; }
	  function halfDown(y){ return Math.round(y) - 0.5; }

	  var context = this.elementContext;

	  var label, x, y, tick, i;

	  var labelStyle = {
	    position: "absolute",
	    fontSize: this.attr_('axisLabelFontSize') + "px",
	    zIndex: 10,
	    color: this.attr_('axisLabelColor'),
	    width: this.attr_('axisLabelWidth') + "px",
	    // height: this.attr_('axisLabelFontSize') + 2 + "px",
	    lineHeight: "normal",  // Something other than "normal" line-height screws up label positioning.
	    overflow: "hidden"
	  };
	  var makeDiv = function(txt, axis, prec_axis) {
	    var div = document.createElement("div");
	    for (var name in labelStyle) {
	      if (labelStyle.hasOwnProperty(name)) {
	        div.style[name] = labelStyle[name];
	      }
	    }
	    var inner_div = document.createElement("div");
	    inner_div.className = 'dygraph-axis-label' +
	                          ' dygraph-axis-label-' + axis +
	                          (prec_axis ? ' dygraph-axis-label-' + prec_axis : '');
	    inner_div.innerHTML=txt;
	    div.appendChild(inner_div);
	    return div;
	  };

	  // axis lines
	  context.save();
	  context.strokeStyle = this.attr_('axisLineColor');
	  context.lineWidth = this.attr_('axisLineWidth');

	  if (this.attr_('drawYAxis')) {
	    if (this.layout.yticks && this.layout.yticks.length > 0) {
	      var num_axes = this.dygraph_.numAxes();
	      for (i = 0; i < this.layout.yticks.length; i++) {
	        tick = this.layout.yticks[i];
	        if (typeof(tick) == "function") return;
	        x = this.area.x;
	        var sgn = 1;
	        var prec_axis = 'y1';
	        if (tick[0] == 1) {  // right-side y-axis
	          x = this.area.x + this.area.w;
	          sgn = -1;
	          prec_axis = 'y2';
	        }
	        y = this.area.y + tick[1] * this.area.h;

	        /* Tick marks are currently clipped, so don't bother drawing them.
	        context.beginPath();
	        context.moveTo(halfUp(x), halfDown(y));
	        context.lineTo(halfUp(x - sgn * this.attr_('axisTickSize')), halfDown(y));
	        context.closePath();
	        context.stroke();
	        */

	        label = makeDiv(tick[2], 'y', num_axes == 2 ? prec_axis : null);
	        var top = (y - this.attr_('axisLabelFontSize') / 2);
	        if (top < 0) top = 0;

	        if (top + this.attr_('axisLabelFontSize') + 3 > this.height) {
	          label.style.bottom = "0px";
	        } else {
	          label.style.top = top + "px";
	        }
	        if (tick[0] === 0) {
	          label.style.left = (this.area.x - this.attr_('yAxisLabelWidth') - this.attr_('axisTickSize')) + "px";
	          label.style.textAlign = "right";
	        } else if (tick[0] == 1) {
	          label.style.left = (this.area.x + this.area.w +
	                              this.attr_('axisTickSize')) + "px";
	          label.style.textAlign = "left";
	        }
	        label.style.width = this.attr_('yAxisLabelWidth') + "px";
	        this.container.appendChild(label);
	        this.ylabels.push(label);
	      }

	      // The lowest tick on the y-axis often overlaps with the leftmost
	      // tick on the x-axis. Shift the bottom tick up a little bit to
	      // compensate if necessary.
	      var bottomTick = this.ylabels[0];
	      var fontSize = this.attr_('axisLabelFontSize');
	      var bottom = parseInt(bottomTick.style.top, 10) + fontSize;
	      if (bottom > this.height - fontSize) {
	        bottomTick.style.top = (parseInt(bottomTick.style.top, 10) -
	            fontSize / 2) + "px";
	      }
	    }

	    // draw a vertical line on the left to separate the chart from the labels.
	    var axisX;
	    if (this.attr_('drawAxesAtZero')) {
	      var r = this.dygraph_.toPercentXCoord(0);
	      if (r > 1 || r < 0) r = 0;
	      axisX = halfUp(this.area.x + r * this.area.w);
	    } else {
	      axisX = halfUp(this.area.x);
	    }
	    context.beginPath();
	    context.moveTo(axisX, halfDown(this.area.y));
	    context.lineTo(axisX, halfDown(this.area.y + this.area.h));
	    context.closePath();
	    context.stroke();

	    // if there's a secondary y-axis, draw a vertical line for that, too.
//	    if (this.dygraph_.numAxes() == 2) {
	      context.beginPath();
	      context.moveTo(halfDown(this.area.x + this.area.w), halfDown(this.area.y));
	      context.lineTo(halfDown(this.area.x + this.area.w), halfDown(this.area.y + this.area.h));
	      context.closePath();
	      context.stroke();
//	    }
	  }

	  if (this.attr_('drawXAxis')) {
	    if (this.layout.xticks) {
	      for (i = 0; i < this.layout.xticks.length; i++) {
	        tick = this.layout.xticks[i];
	        x = this.area.x + tick[0] * this.area.w;
	        y = this.area.y + this.area.h;

	        /* Tick marks are currently clipped, so don't bother drawing them.
	        context.beginPath();
	        context.moveTo(halfUp(x), halfDown(y));
	        context.lineTo(halfUp(x), halfDown(y + this.attr_('axisTickSize')));
	        context.closePath();
	        context.stroke();
	        */

	        label = makeDiv(tick[1], 'x');
	        label.style.textAlign = "center";
	        label.style.top = (y + this.attr_('axisTickSize')) + 'px';

	        var left = (x - this.attr_('axisLabelWidth')/2);
	        if (left + this.attr_('axisLabelWidth') > this.width) {
	          left = this.width - this.attr_('xAxisLabelWidth');
	          label.style.textAlign = "right";
	        }
	        if (left < 0) {
	          left = 0;
	          label.style.textAlign = "left";
	        }

	        label.style.left = left + "px";
	        label.style.width = this.attr_('xAxisLabelWidth') + "px";
	        this.container.appendChild(label);
	        this.xlabels.push(label);
	      }
	    }

	    context.beginPath();
	    var axisY;
	    if (this.attr_('drawAxesAtZero')) {
	      var r = this.dygraph_.toPercentYCoord(0, 0);
	      if (r > 1 || r < 0) r = 1;
	      axisY = halfDown(this.area.y + r * this.area.h);
	    } else {
	      axisY = halfDown(this.area.y + this.area.h);
	    }
	    context.moveTo(halfUp(this.area.x), axisY);
	    context.lineTo(halfUp(this.area.x + this.area.w), axisY);
	    context.closePath();
	    context.stroke();
	    
	    //
	    context.beginPath();
	    context.moveTo(halfUp(this.area.x), halfDown(this.area.y)+1);
	    context.lineTo(halfUp(this.area.x + this.area.w), halfDown(this.area.y)+1);
	    context.closePath();
	    context.stroke();
	  }

	  context.restore();
	};

}