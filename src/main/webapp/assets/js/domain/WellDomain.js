GWDP.domain.Well.typeName = "VW_GWDP_GEOSERVER";
GWDP.domain.Well.featurePrefix = "ngwmn";

GWDP.domain.Well.WFSAjaxParams = function(bbox) {
	var params = {
		SERVICE: 'WFS',
		VERSION: "1.0.0",
		srsName: "EPSG:4326",
		outputFormat: 'GML2',
		typeName: GWDP.domain.Well.featurePrefix + ':' + GWDP.domain.Well.typeName
	};
	if(bbox) {
		params.bbox = bbox;
	}
	return params;
};

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


//TODO move to base domain if method is reused often
GWDP.domain.getFilterCQL = function(filters) {
	var filterArray = [];
	for(var k in filters) {
		filterArray.push(new OpenLayers.Filter.Comparison({
          type: OpenLayers.Filter.Comparison.EQUAL_TO,
          property: k,
          value: filters[k]
      }));
	}
	
	var olFilter = new OpenLayers.Filter.Logical({
      type: OpenLayers.Filter.Logical.AND,
      filters: filterArray
  });
	
	return olFilter.toString();
};

GWDP.domain.Well.constructParams = function(bbox, filters, forHits) {
	var requestParams = GWDP.domain.Well.WFSAjaxParams();
	
	if(forHits) {
		requestParams.resultType="hits"; 
		requestParams.VERSION="1.1.0"; //to enable resultType=hits
	}
	
	if(!filters) {
		requestParams.BBOX=bbox;
	} else {
		//TODO include bbox inside of filtering mechanism
		requestParams.CQL_FILTER=GWDP.domain.getFilterCQL(filters);
	}
	
	return requestParams;
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
		params: GWDP.domain.Well.constructParams(bbox, filters, false),
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
		params: GWDP.domain.Well.constructParams(bbox, filters, true),
		success: function(response, options) {
			var numOfRecs = response.responseXML.lastChild.attributes.getNamedItem('numberOfFeatures').value;
			callback(numOfRecs);
		}
	})
};
