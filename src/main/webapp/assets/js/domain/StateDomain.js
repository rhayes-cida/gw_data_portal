GWDP.domain.State.featurePrefix = "ngwmn";
GWDP.domain.State.typeName = GWDP.domain.State.featurePrefix + ":VW_GWDP_STATES"; //TODO plug in correct layer name here

GWDP.domain.State.WFSProtocol = new OpenLayers.Protocol.WFS.v1_1_0({
	outputFormat: 'GML2',
	geometryName: 'GEOM',
	featurePrefix: GWDP.domain.State.featurePrefix,
	featureType: GWDP.domain.State.typeName
});

/**
 * @param bbox bbox must be in format x,y,x,y
 * @param filters json object describing filters, method will convert to CQL. Only supports AND filtering.
 * @param callback function that takes an array of json objects which represents a feature
 */
GWDP.domain.State.getStates = function(bbox, filters, callback) {	
	GWDP.domain.getDomainObjects(GWDP.domain.State.WFSProtocol, GWDP.domain.State.typeName, bbox, filters, callback);
};

/**
 * @param bbox bbox must be in format y,x,y,x
 * @param filters json object describing filters, method will convert to CQL. Only supports AND filtering.
 * @param callback function that takes numOfRecs as single parameter
 */
GWDP.domain.State.getStateCount = function(bbox, filters, callback) {
	GWDP.domain.getDomainObjectsCount(GWDP.domain.State.typeName, bbox, filters, callback);
};

/**
 * @param params json object describing filters, method will convert to CQL. Only supports AND filtering.
 * @param callback function that takes numOfRecs as single parameter
 */
GWDP.domain.State.getStateMetadata = function(params, callback) {
	Ext.Ajax.request({
		url: 'metadata/states',
		method: 'GET',
		params: params, 
		success: function(response, options) {
			var responseObject = {data: Ext.util.JSON.decode(response.responseText) };
			callback(responseObject);
		}
	});
};