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
	var WFSbbox = bbox.toBBOX(); 
	
	var requestParams = GWDP.domain.Well.WFSAjaxParams(WFSbbox);
	//requestParams.resultType=hits; TODO enable this when we get a primary key on VW_GWDP_GEOSERVER, it is broken right now
	
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
					//TODO instead of parsing entire result set, use the FeatureCollection@numberOfFeatures for the count when resultType=hits
					var records = GWDP.domain.Well.WFSProtocol.parseResponse(response);
					GWDP.ui.pointsCount.update(records.length + " Points Mapped");
				}
			});
		}
	};
	deferredCall.defer(GWDP.domain.Well.updateWellCountBuffer + 5, this);//wait just long enough to pass the buffered time.
};