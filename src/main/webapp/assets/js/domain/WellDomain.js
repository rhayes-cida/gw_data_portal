GWDP.domain.Well.typeName = "VW_GWDP_GEOSERVER";
GWDP.domain.Well.featurePrefix = "ngwmn";

GWDP.domain.Well.WFSAjaxParams = function(bbox) {
	return {
		SERVICE: 'WFS',
		VERSION: "1.0.0",
		srsName: "EPSG:4326",
		outputFormat: 'GML2',
		BBOX: bbox,
		typeName: GWDP.domain.Well.featurePrefix + ':' + GWDP.domain.Well.typeName
	}
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
	var updateCount = function(records) {
		
	};
	
	var bbox = bounds.transform(GWDP.ui.map.mercatorProjection,GWDP.ui.map.wgs84Projection);
	var bboxArray = bbox.toArray();
	var WFSbbox = bboxArray[1] + ',' + bboxArray[0] + ',' + bboxArray[3] + ',' + bboxArray[2];  //wfs v1.1.0 uses a y,x coordinate format
	
	var requestParams = GWDP.domain.Well.WFSAjaxParams(WFSbbox);
	requestParams.resultType="hits"; 
	requestParams.VERSION="1.1.0"; //to enable resultType=hits
	
	GWDP.domain.Well.updateWellCountLastCall = new Date();
	
	//console.log(GWDP.domain.Well.updateWellCountLastCall);
	var deferredCall = function() {
		var actualCallTime = new Date();
		var elapsedTime = actualCallTime - GWDP.domain.Well.updateWellCountLastCall;
		//console.log('Should we call at ' + actualCallTime + '? ' + elapsedTime + ' has elapsed;');
		if(elapsedTime > GWDP.domain.Well.updateWellCountBuffer){
			GWDP.ui.pointsCount.update("Calculating Points Mapped...");
			Ext.Ajax.request({
				url: GWDP.ui.map.baseWFSServiceUrl,
				method: 'GET',
				params: requestParams, 
				success: function(response, options) {
					var numOfRecs = response.responseXML.lastChild.attributes.getNamedItem('numberOfFeatures').value;
					GWDP.ui.pointsCount.update(numOfRecs + " Points Mapped");
				}
			});
		}
	};
	deferredCall.defer(GWDP.domain.Well.updateWellCountBuffer + 5, this);//wait just long enough to pass the buffered time.
};

GWDP.domain.Well.getWells = function(bbox, filters, callback) {
	//TODO do something with filters
	Ext.Ajax.request({
		url: GWDP.ui.map.baseWFSServiceUrl,
		method: 'GET',
		params: GWDP.domain.Well.WFSAjaxParams(bbox),
		success: function(response, options) {
			callback(GWDP.domain.Well.WFSProtocol.parseResponse(response));
		}
	})
};