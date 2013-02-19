/**
 * TODO this whol domain can be changed to use straight ExtJS stores and AJAX if we are not using WFS
 */

GWDP.domain.Agency.featurePrefix = "ngwmn";
GWDP.domain.Agency.typeName = GWDP.domain.Agency.featurePrefix + ":VW_GWDP_AGENCY"; //TODO get real layer name

GWDP.domain.Agency.WFSProtocol = new OpenLayers.Protocol.WFS.v1_1_0({
	outputFormat: 'GML2',
	geometryName: 'GEOM',
	featurePrefix: GWDP.domain.Agency.featurePrefix,
	featureType: GWDP.domain.Agency.typeName
});

/**
 * @param bbox bbox must be in format x,y,x,y
 * @param filters json object describing filters, method will convert to CQL. Only supports AND filtering.
 * @param callback function that takes an array of json objects which represents a feature
 */
//TODO, this is using the WFS base domain, will probably just need to go to regular AJAX call to our own WS
GWDP.domain.Agency.getAgencies = function(bbox, filters, callback) {	
	GWDP.domain.getDomainObjects(GWDP.domain.Agency.WFSProtocol, GWDP.domain.Agency.typeName, bbox, filters, callback);
};

/**
 * @param bbox bbox must be in format y,x,y,x
 * @param filters json object describing filters, method will convert to CQL. Only supports AND filtering.
 * @param callback function that takes numOfRecs as single parameter
 */
//TODO, this is using the WFS base domain, will probably just need to go to regular AJAX call to our own WS
GWDP.domain.Agency.getAgencyCount = function(bbox, filters, callback) {
	GWDP.domain.getDomainObjectsCount(GWDP.domain.Agency.typeName, bbox, filters, callback);
};
