GWDP.domain.Well.featurePrefix = "ngwmn";
GWDP.domain.Well.typeName = GWDP.domain.Well.featurePrefix + ":VW_GWDP_GEOSERVER";

GWDP.domain.Well.WFSProtocol = new OpenLayers.Protocol.WFS.v1_1_0({
	outputFormat: 'GML2',
	geometryName: 'GEOM',
	featurePrefix: GWDP.domain.Well.featurePrefix,
	featureType: GWDP.domain.Well.typeName
});

//time in ms to buffer calls, this prevents chatty ajax calls and will only 
//call after the event has settled for this time period
GWDP.domain.Well.updateWellCountBuffer = 1000; 
GWDP.domain.Well.updateWellCountLastCall = new Date(); //timestamp of the last time this function was called
GWDP.domain.Well.updateWellCount = function(map, filters) {
	var bounds = map.getExtent();
	
	//convert bbox from x,y,x,y to y,x,y,x
	var bbox = bounds.transform(GWDP.ui.map.mercatorProjection,GWDP.ui.map.wgs84Projection);
	var bboxArray = bbox.toArray();
	var WFSbbox = bboxArray[1] + ',' + bboxArray[0] + ',' + bboxArray[3] + ',' + bboxArray[2];  //wfs v1.1.0 uses a y,x coordinate format
	
	GWDP.domain.Well.updateWellCountLastCall = new Date();
	
	var _updateCount = function(numOfRecs) {
		GWDP.ui.pointsCount.update(numOfRecs + " Points Mapped");
	};
	
	//console.log(GWDP.domain.Well.updateWellCountLastCall);
	var deferredCall = function() {
		var actualCallTime = new Date();
		var elapsedTime = actualCallTime - GWDP.domain.Well.updateWellCountLastCall;
		//console.log('Should we call at ' + actualCallTime + '? ' + elapsedTime + ' has elapsed;');
		if(elapsedTime > GWDP.domain.Well.updateWellCountBuffer){
			GWDP.ui.pointsCount.update("Calculating Points Mapped...");
			GWDP.domain.Well.getWellCount(WFSbbox, null, _updateCount);
		}
	};
	deferredCall.defer(GWDP.domain.Well.updateWellCountBuffer + 5, this);//wait just long enough to pass the buffered time.
};


/**
 * @param bbox bbox must be in format x,y,x,y
 * @param filters json object describing filters, method will convert to CQL. Only supports AND filtering.
 * @param callback function that takes an array of json objects which represents a feature
 */
GWDP.domain.Well.getWells = function(bbox, filters, callback) {	
	Ext.Ajax.request({
		url: GWDP.ui.map.baseWFSServiceUrl,
		method: 'GET',
		params: GWDP.domain.constructParams(GWDP.domain.Well.typeName, bbox, filters, false),
		success: function(response, options) {
			callback(GWDP.domain.Well.WFSProtocol.parseResponse(response));
		}
	});
};

/**
 * @param bbox bbox must be in format y,x,y,x
 * @param filters json object describing filters, method will convert to CQL. Only supports AND filtering.
 * @param callback function that takes numOfRecs as single parameter
 */
GWDP.domain.Well.getWellCount = function(bbox, filters, callback) {
	Ext.Ajax.request({
		url: GWDP.ui.map.baseWFSServiceUrl,
		method: 'GET',
		params: GWDP.domain.constructParams(GWDP.domain.Well.typeName, bbox, filters, true),
		success: function(response, options) {
			var numOfRecs = response.responseXML.lastChild.attributes.getNamedItem('numberOfFeatures').value;
			callback(numOfRecs);
		}
	});
};
