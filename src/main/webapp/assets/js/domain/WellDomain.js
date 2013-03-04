GWDP.domain.Well.featurePrefix = "ngwmn";
GWDP.domain.Well.typeName = GWDP.domain.Well.featurePrefix + ":VW_GWDP_GEOSERVER";

GWDP.domain.Well.fields = ['SITE_NO','SITE_NAME','DEC_LAT_VA','DEC_LONG_VA','QW_WELL_TYPE','QW_WELL_CHARS','WL_WELL_TYPE','WL_WELL_CHARS','WELL_DEPTH','LOCAL_AQUIFER_NAME','NAT_AQFR_DESC','AGENCY_CD','AGENCY_NM','WL_SN_FLAG','QW_SN_FLAG','LINK',
  			             'WL_DATA_FLAG','QW_DATA_FLAG','LOG_DATA_FLAG','STATE_CD'];

GWDP.domain.Well.WFSProtocol = new OpenLayers.Protocol.WFS.v1_1_0({
	outputFormat: 'GML2',
	geometryName: 'GEOM',
	featurePrefix: GWDP.domain.Well.featurePrefix,
	featureType: GWDP.domain.Well.typeName
});

//time in ms to buffer calls, this prevents chatty ajax calls and will only 
//call after the event has settled for this time period
//TODO refactor this out to be reusable OR find any extjs/OL equivilant function
GWDP.domain.Well.updateWellCountBuffer = 1000; 
GWDP.domain.Well.updateWellCountLastCall = new Date(); //timestamp of the last time this function was called
GWDP.domain.Well.updateWellCount = function(map, cql_filter) {
	GWDP.ui.pointsCount.update("Calculating Sites Mapped...");
	GWDP.ui.waterLevelCount.update("");
	GWDP.ui.waterQualityCount.update("");
	
	
	//convert bbox from x,y,x,y to y,x,y,x
	var bounds = map.getExtent();
	var bbox = bounds.transform(GWDP.ui.map.mercatorProjection,GWDP.ui.map.wgs84Projection);
	var bboxArray = bbox.toArray();
	var WFSbbox = GWDP.domain.convertXyToYx(bboxArray); 
	
	GWDP.domain.Well.updateWellCountLastCall = new Date();
	
	var _updateTotalCount = function(numOfRecs) {
		GWDP.ui.pointsCount.update(numOfRecs + " Sites Mapped");
	};
	
	var _updateWLCount = function(numOfRecs) {
		GWDP.ui.waterLevelCount.update(numOfRecs + " water-level network wells");
	};
	
	var _updateQWCount = function(numOfRecs) {
		GWDP.ui.waterQualityCount.update(numOfRecs + " water-quality network wells");
	};
	
	//console.log(GWDP.domain.Well.updateWellCountLastCall);
	var deferredCall = function() {
		var actualCallTime = new Date();
		var elapsedTime = actualCallTime - GWDP.domain.Well.updateWellCountLastCall;
		//console.log('Should we call at ' + actualCallTime + '? ' + elapsedTime + ' has elapsed;');
		if(elapsedTime > GWDP.domain.Well.updateWellCountBuffer){
			GWDP.domain.Well.getWellCount(WFSbbox, cql_filter, _updateTotalCount);
			if(cql_filter) {
				GWDP.domain.Well.getWellCount(WFSbbox, "(WL_SN_FLAG = '1') AND (" + cql_filter + ")", _updateWLCount);
				GWDP.domain.Well.getWellCount(WFSbbox, "(QW_SN_FLAG = '1') AND (" + cql_filter + ")", _updateQWCount);
			} else {
				GWDP.domain.Well.getWellCount(WFSbbox, "(WL_SN_FLAG = '1')", _updateWLCount);
				GWDP.domain.Well.getWellCount(WFSbbox, "(QW_SN_FLAG = '1')", _updateQWCount);
			}
		}
	};
	deferredCall.defer(GWDP.domain.Well.updateWellCountBuffer + 5, this);//wait just long enough to pass the buffered time.
};


/**
 * @param bbox bbox must be in format x,y,x,y
 * @param cql_filter string representation of the filters.
 * @param callback function that takes an array of json objects which represents a feature
 */
GWDP.domain.Well.getWells = function(bbox, cql_filter, callback) {	
	GWDP.domain.getDomainObjects(GWDP.domain.Well.WFSProtocol, GWDP.domain.Well.typeName, bbox, cql_filter, callback);
};

/**
 * @param bbox bbox must be in format y,x,y,x
 * @param cql_filter string representation of the filters.
 * @param callback function that takes numOfRecs as single parameter
 */
GWDP.domain.Well.getWellCount = function(bbox, cql_filter, callback) {
	GWDP.domain.getDomainObjectsCount(GWDP.domain.Well.typeName, bbox, cql_filter, callback);
};
