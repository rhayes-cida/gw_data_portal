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
GWDP.domain.Well.updateWellCount = function(url, bbox, cql_filter, updateHandlers) {
	
	GWDP.domain.Well.updateWellCountLastCall = new Date();
	
	var deferredCall = function() {
		var actualCallTime = new Date();
		var elapsedTime = actualCallTime - GWDP.domain.Well.updateWellCountLastCall;
		//console.log('Should we call at ' + actualCallTime + '? ' + elapsedTime + ' has elapsed;');
		if(elapsedTime > GWDP.domain.Well.updateWellCountBuffer){
			GWDP.domain.Well.getWellCount(url, bbox, cql_filter, updateHandlers.totalCount);
			if(cql_filter) {
				GWDP.domain.Well.getWellCount(url, bbox, "(WL_SN_FLAG = '1') AND (" + cql_filter + ")", updateHandlers.waterLevelCount);
				GWDP.domain.Well.getWellCount(url, bbox, "(QW_SN_FLAG = '1') AND (" + cql_filter + ")", updateHandlers.waterQualityCount);
			} else {
				GWDP.domain.Well.getWellCount(url, bbox, "(WL_SN_FLAG = '1')", updateHandlers.waterLevelCount);
				GWDP.domain.Well.getWellCount(url, bbox, "(QW_SN_FLAG = '1')", updateHandlers.waterQualityCount);
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
GWDP.domain.Well.getWells = function(url, bbox, cql_filter, callback) {	
	GWDP.domain.getDomainObjects(url, GWDP.domain.Well.WFSProtocol, GWDP.domain.Well.typeName, bbox, cql_filter, callback);
};

/**
 * @param bbox bbox must be in format y,x,y,x
 * @param cql_filter string representation of the filters.
 * @param callback function that takes numOfRecs as single parameter
 */
GWDP.domain.Well.getWellCount = function(url, bbox, cql_filter, callback) {
	GWDP.domain.getDomainObjectsCount(url, GWDP.domain.Well.typeName, bbox, cql_filter, callback);
};

/**
 * @param bbox bbox must be in format y,x,y,x
 * @param cql_filter string representation of the filters.
 * @param callback function that takes numOfRecs as single parameter
 */
GWDP.domain.Well.getQWWellCount = function(url, bbox, cql_filter, callback) {
	GWDP.domain.Well.getWellCount(url, bbox, "(QW_SN_FLAG = '1') AND (" + cql_filter + ")", callback);
};

/**
 * @param bbox bbox must be in format y,x,y,x
 * @param cql_filter string representation of the filters.
 * @param callback function that takes numOfRecs as single parameter
 */
GWDP.domain.Well.getWLWellCount = function(url, bbox, cql_filter, callback) {
	GWDP.domain.Well.getWellCount(url, bbox, "(WL_SN_FLAG = '1') AND (" + cql_filter + ")", callback);
};
