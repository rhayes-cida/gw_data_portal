GWDP.domain.Agency.featurePrefix = "ngwmn";
GWDP.domain.Agency.typeName = GWDP.domain.Agency.featurePrefix + ":VW_GWDP_AGENCY"; //TODO get real layer name

GWDP.domain.Agency.WFSProtocol = new OpenLayers.Protocol.WFS.v1_1_0({
	outputFormat: 'GML2',
	geometryName: 'GEOM',
	featurePrefix: GWDP.domain.Agency.featurePrefix,
	featureType: GWDP.domain.Agency.typeName
});

GWDP.domain.Agency.fields = [];

/**
 * @param bbox bbox must be in format x,y,x,y
 * @param filters json object describing filters, method will convert to CQL. Only supports AND filtering.
 * @param callback function that takes an array of json objects which represents a feature
 */
GWDP.domain.Agency.getAgencies = function(bbox, filters, callback) {	
	GWDP.domain.getDomainObjects(GWDP.domain.Agency.WFSProtocol, GWDP.domain.Agency.typeName, bbox, filters, callback);
};

/**
 * @param bbox bbox must be in format y,x,y,x
 * @param filters json object describing filters, method will convert to CQL. Only supports AND filtering.
 * @param callback function that takes numOfRecs as single parameter
 */
GWDP.domain.Agency.getAgencyCount = function(bbox, filters, callback) {
	GWDP.domain.getDomainObjectsCount(GWDP.domain.Agency.typeName, bbox, filters, callback);
};

/**
 * @param params json object describing filters, method will convert to CQL. Only supports AND filtering.
 * @param callback function that takes numOfRecs as single parameter
 */
GWDP.domain.Agency.getAgencyMetadata = function(params, callback) {
	Ext.Ajax.request({
		url: 'metadata/agencies',
		method: 'GET',
		params: params, 
		success: function(response, options) {
			var responseObject = {data: Ext.util.JSON.decode(response.responseText) };
			callback(responseObject);
		}
	});
};

GWDP.domain.Agency.getAgencyStore = function(params) {
	var str = GWDP.domain.getJsonStore(['AGENCY_CD','AGENCY_NM','COUNT'], "metadata/agencies");
	//include All field
	str.loadData([{AGENCY_CD: 'All', AGENCY_NM: 'All',COUNT:'All'}]);
	return str;
};
