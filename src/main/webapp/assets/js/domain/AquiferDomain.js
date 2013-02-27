GWDP.domain.Aquifer.featurePrefix = "ngwmn";
GWDP.domain.Aquifer.typeName = GWDP.domain.Aquifer.featurePrefix + ":VW_GWDP_AQUIFERS"; //TODO get real layer name

GWDP.domain.Aquifer.WFSProtocol = new OpenLayers.Protocol.WFS.v1_1_0({
	outputFormat: 'GML2',
	geometryName: 'GEOM',
	featurePrefix: GWDP.domain.Aquifer.featurePrefix,
	featureType: GWDP.domain.Aquifer.typeName
});

/**
 * @param bbox bbox must be in format x,y,x,y
 * @param filters json object describing filters, method will convert to CQL. Only supports AND filtering.
 * @param callback function that takes an array of json objects which represents a feature
 */
GWDP.domain.Aquifer.getAquifers = function(bbox, filters, callback) {	
	GWDP.domain.getDomainObjects(GWDP.domain.Aquifer.WFSProtocol, GWDP.domain.Aquifer.typeName, bbox, filters, callback);
};

/**
 * @param bbox bbox must be in format y,x,y,x
 * @param filters json object describing filters, method will convert to CQL. Only supports AND filtering.
 * @param callback function that takes numOfRecs as single parameter
 */
GWDP.domain.Aquifer.getAquiferCount = function(bbox, filters, callback) {
	GWDP.domain.getDomainObjectsCount(GWDP.domain.Aquifer.typeName, bbox, filters, callback);
};


/**
 * @param params json object describing filters, method will convert to CQL. Only supports AND filtering.
 * @param callback function that takes numOfRecs as single parameter
 */
GWDP.domain.Aquifer.getAquiferMetadata = function(params, callback) {
	Ext.Ajax.request({
		url: 'metadata/aquifers',
		method: 'GET',
		params: params, 
		success: function(response, options) {
			var responseObject = {data: Ext.util.JSON.decode(response.responseText) };
			callback(responseObject);
		}
	});
};

GWDP.domain.Aquifer.getAquiferStore = function(params) {
	var str = GWDP.domain.getJsonStore(['AQUIFER','AQUIFERCODE','COUNT'], "metadata/aquifers");
	//include All field
	str.loadData([{AQUIFER: 'All', AQUIFERCODE: 'All',COUNT:'All'}]);
	return str;
};